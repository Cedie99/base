"use server";

import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth.helpers";
import {
  createListingSchema,
  updateListingSchema,
} from "@/lib/validations/listing";
import { generateSlug } from "@/lib/utils/slug";
import { checkSlugExists, getListingById } from "@/lib/listings.queries";
import { createRevision } from "@/lib/revisions";

export type ActionState = {
  error?: string;
  success?: boolean;
  id?: string;
};

export async function createListing(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return { error: "Unauthorized" };
  }

  const raw = Object.fromEntries(formData.entries());

  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
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

  const approvalStatus =
    user.role === "admin" || user.role === "moderator" ? "approved" : "pending";

  const [listing] = await db
    .insert(listings)
    .values({
      ...data,
      employees:
        typeof data.employees === "number" ? data.employees : undefined,
      servers: typeof data.servers === "number" ? data.servers : undefined,
      domainsManaged:
        typeof data.domainsManaged === "number"
          ? data.domainsManaged
          : undefined,
      clients: typeof data.clients === "number" ? data.clients : undefined,
      numberOfDatacenters:
        typeof data.numberOfDatacenters === "number"
          ? data.numberOfDatacenters
          : undefined,
      totalSquareFootage: data.totalSquareFootage || null,
      blogFeedUrl: data.blogFeedUrl || null,
      stockTicker: data.stockTicker || null,
      companyStatus: data.companyStatus || null,
      approvalStatus,
      createdById: user.id,
    })
    .returning();

  await createRevision({
    listingId: listing.id,
    action: "create",
    entityType: "listing",
    entityId: listing.id,
    after: data,
  });

  revalidatePath("/dashboard/listings");
  return { success: true, id: listing.id };
}

export async function updateListing(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return { error: "Unauthorized" };
  }

  const raw = Object.fromEntries(formData.entries());
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    cleaned[key] = value === "" ? undefined : value;
  }

  const parsed = updateListingSchema.safeParse(cleaned);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, ...data } = parsed.data;

  if (data.slug && data.category) {
    const slugExists = await checkSlugExists(data.category, data.slug, id);
    if (slugExists) {
      return {
        error: "A listing with this slug already exists in this category",
      };
    }
  }

  // Capture before state for revision
  const before = await getListingById(id);

  await db
    .update(listings)
    .set({
      ...data,
      employees:
        typeof data.employees === "number" ? data.employees : undefined,
      servers: typeof data.servers === "number" ? data.servers : undefined,
      domainsManaged:
        typeof data.domainsManaged === "number"
          ? data.domainsManaged
          : undefined,
      clients: typeof data.clients === "number" ? data.clients : undefined,
      numberOfDatacenters:
        typeof data.numberOfDatacenters === "number"
          ? data.numberOfDatacenters
          : undefined,
      totalSquareFootage: data.totalSquareFootage || null,
      blogFeedUrl: data.blogFeedUrl || null,
      stockTicker: data.stockTicker || null,
      companyStatus: data.companyStatus || null,
      updatedAt: new Date(),
    })
    .where(eq(listings.id, id));

  await createRevision({
    listingId: id,
    action: "update",
    entityType: "listing",
    entityId: id,
    before,
    after: data,
  });

  revalidatePath("/dashboard/listings");
  return { success: true, id };
}

export async function deleteListing(id: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { error: "Only admins can delete listings" };
  }

  const before = await getListingById(id);

  await createRevision({
    listingId: id,
    action: "delete",
    entityType: "listing",
    entityId: id,
    before,
  });

  await db.delete(listings).where(eq(listings.id, id));

  revalidatePath("/dashboard/listings");
  return { success: true };
}

export async function updateListingStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return { error: "Unauthorized" };
  }

  await db
    .update(listings)
    .set({ approvalStatus: status, updatedAt: new Date() })
    .where(eq(listings.id, id));

  await createRevision({
    listingId: id,
    action: "update",
    entityType: "listing",
    entityId: id,
    after: { approvalStatus: status },
  });

  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/moderation");
  return { success: true };
}
