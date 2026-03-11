"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { listings, listingOffices, listingProducts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth.helpers";
import { createListingSchema } from "@/lib/validations/listing";
import { generateSlug } from "@/lib/utils/slug";
import { checkSlugExists, getListingById } from "@/lib/listings.queries";
import { createRevision } from "@/lib/revisions";
import type { ActionState } from "@/lib/listings.actions";

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown"
  );
}

interface OfficeInput {
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isHq?: boolean;
}

interface ProductInput {
  name: string;
}

function parseWidgetJson<T>(formData: FormData, key: string): T[] {
  const raw = formData.get(key);
  if (!raw || typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function submitListing(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  const ip = await getClientIp();

  const raw = Object.fromEntries(formData.entries());
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("__")) continue; // skip widget JSON inputs
    cleaned[key] = value === "" ? undefined : value;
  }

  if (!cleaned.slug && cleaned.name) {
    cleaned.slug = generateSlug(cleaned.name as string);
  }

  const parsed = createListingSchema.safeParse(cleaned);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  const slugExists = await checkSlugExists(data.category, data.slug);
  if (slugExists) {
    return { error: "A listing with this slug already exists in this category" };
  }

  // Role-aware approval
  const autoApprove =
    user?.role === "admin" || user?.role === "moderator";
  const approvalStatus = autoApprove ? "approved" : "pending";

  const [listing] = await db
    .insert(listings)
    .values({
      ...data,
      employees: typeof data.employees === "number" ? data.employees : undefined,
      servers: typeof data.servers === "number" ? data.servers : undefined,
      domainsManaged:
        typeof data.domainsManaged === "number" ? data.domainsManaged : undefined,
      clients: typeof data.clients === "number" ? data.clients : undefined,
      companyStatus: data.companyStatus || null,
      approvalStatus,
      createdById: user?.id ?? null,
      createdByIp: !user ? ip : null,
    })
    .returning();

  // Parse and insert widget data
  const offices = parseWidgetJson<OfficeInput>(formData, "__offices");
  if (offices.length > 0) {
    await db.insert(listingOffices).values(
      offices.map((o) => ({
        listingId: listing.id,
        address: o.address,
        city: o.city || null,
        state: o.state || null,
        country: o.country || null,
        postalCode: o.postalCode || null,
        isHq: o.isHq ?? false,
      }))
    );
  }

  const products = parseWidgetJson<ProductInput>(formData, "__products");
  if (products.length > 0) {
    await db.insert(listingProducts).values(
      products.map((p) => ({
        listingId: listing.id,
        name: p.name,
      }))
    );
  }

  revalidatePath("/");
  return { success: true };
}

export async function submitListingEdit(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  const ip = await getClientIp();

  const raw = Object.fromEntries(formData.entries());
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("__")) continue; // skip widget JSON inputs
    cleaned[key] = value === "" ? undefined : value;
  }

  const id = cleaned.id as string;
  if (!id) return { error: "Missing listing ID" };

  // Fetch existing listing WITH widgets for before snapshot
  const existing = await getListingById(id);
  if (!existing) return { error: "Listing not found" };

  const autoApprove =
    user?.role === "admin" || user?.role === "moderator";

  // Build listing field updates
  const updateData: Record<string, unknown> = {};
  const fields = [
    "name", "legalName", "url", "phone", "email", "overview", "logoUrl",
    "foundingDate", "firstName", "lastName", "homepageUrl", "blogUrl",
    "twitterUsername", "linkedinUrl", "facebookUrl", "instagramUrl",
    "tiktokUrl", "birthplace", "birthdate", "photoUrl",
  ];

  for (const field of fields) {
    if (cleaned[field] !== undefined) {
      updateData[field] = cleaned[field];
    }
  }

  if (cleaned.employees !== undefined) {
    updateData.employees = Number(cleaned.employees) || null;
  }
  if (cleaned.servers !== undefined) {
    updateData.servers = Number(cleaned.servers) || null;
  }
  if (cleaned.domainsManaged !== undefined) {
    updateData.domainsManaged = Number(cleaned.domainsManaged) || null;
  }
  if (cleaned.clients !== undefined) {
    updateData.clients = Number(cleaned.clients) || null;
  }
  if (cleaned.companyStatus !== undefined) {
    updateData.companyStatus = (cleaned.companyStatus as string) || null;
  }

  // Parse widget data
  const offices = parseWidgetJson<OfficeInput>(formData, "__offices");
  const products = parseWidgetJson<ProductInput>(formData, "__products");

  // Build before/after snapshots
  const beforeSnapshot = {
    ...Object.fromEntries(
      fields
        .filter((f) => existing[f as keyof typeof existing] !== undefined)
        .map((f) => [f, existing[f as keyof typeof existing]])
    ),
    employees: existing.employees,
    servers: existing.servers,
    domainsManaged: existing.domainsManaged,
    clients: existing.clients,
    companyStatus: existing.companyStatus,
    widgets: {
      offices: existing.offices,
      products: existing.products,
    },
  };

  const afterSnapshot = {
    ...updateData,
    widgets: {
      offices,
      products,
    },
  };

  if (autoApprove) {
    // Admin/mod: apply changes immediately
    updateData.updatedAt = new Date();
    await db.update(listings).set(updateData).where(eq(listings.id, id));

    // Apply widget changes
    if (existing.category !== "person") {
      await db
        .delete(listingOffices)
        .where(eq(listingOffices.listingId, id));
      if (offices.length > 0) {
        await db.insert(listingOffices).values(
          offices.map((o) => ({
            listingId: id,
            address: o.address,
            city: o.city || null,
            state: o.state || null,
            country: o.country || null,
            postalCode: o.postalCode || null,
            isHq: o.isHq ?? false,
          }))
        );
      }

      await db
        .delete(listingProducts)
        .where(eq(listingProducts.listingId, id));
      if (products.length > 0) {
        await db.insert(listingProducts).values(
          products.map((p) => ({
            listingId: id,
            name: p.name,
          }))
        );
      }
    }

    await createRevision({
      listingId: id,
      action: "update",
      entityType: "listing",
      entityId: id,
      before: beforeSnapshot,
      after: afterSnapshot,
      approvalStatus: "approved",
    });
  } else {
    // Regular user: create pending revision, DON'T modify listing
    await createRevision({
      listingId: id,
      action: "update",
      entityType: "listing",
      entityId: id,
      before: beforeSnapshot,
      after: afterSnapshot,
      approvalStatus: "pending",
    });
  }

  void ip; // IP recorded in revision via createRevision

  revalidatePath("/");
  return { success: true };
}
