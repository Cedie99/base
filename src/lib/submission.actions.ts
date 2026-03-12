"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  listings,
  listingOffices,
  listingProducts,
  personDegrees,
  listingPeople,
  listingMilestones,
  listingVideos,
  listingTags,
  listingFunding,
  listingAcquisitions,
  listingExits,
  listingPartners,
  listingScreenshots,
  listingDatacenterLinks,
  listingNews,
  listingExternalLinks,
  listingSources,
  listingCoupons,
  listingIpRanges,
  listingControlPanels,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth.helpers";
import { createListingSchema } from "@/lib/validations/listing";
import { generateSlug } from "@/lib/utils/slug";
import { checkSlugExists, getListingById } from "@/lib/listings.queries";
import { createRevision } from "@/lib/revisions";
import { createNotification } from "@/lib/notifications.helpers";
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

interface DegreeInput {
  institution: string;
  subject?: string;
  degreeType?: string;
  graduationYear?: string;
}

interface PeopleInput {
  name: string;
  title?: string;
  role?: string;
}

interface MilestoneInput {
  title: string;
  description?: string;
  date?: string;
}

interface VideoInput {
  url: string;
  title?: string;
}

interface TagInput {
  tag: string;
}

interface FundingInput {
  roundName?: string;
  amount?: string;
  date?: string;
  investors?: string;
}

interface AcquisitionInput {
  acquiredCompany: string;
  date?: string;
  price?: string;
  description?: string;
}

interface ExitInput {
  exitType: string;
  date?: string;
  amount?: string;
  acquirer?: string;
  description?: string;
}

interface PartnerInput {
  partnerName: string;
  description?: string;
}

interface ScreenshotInput {
  imageUrl: string;
  caption?: string;
}

interface DatacenterLinkInput {
  datacenterName: string;
}

interface NewsInput {
  title: string;
  url?: string;
  source?: string;
  date?: string;
}

interface ExternalLinkInput {
  title: string;
  url: string;
}

interface SourceInput {
  title?: string;
  url: string;
}

interface CouponInput {
  code: string;
  discount: string;
  expiresAt?: string;
}

interface IpRangeInput {
  type: string;
  cidr: string;
  description?: string;
}

interface ControlPanelInput {
  name: string;
  version?: string;
  isDefault?: boolean;
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

async function insertAllWidgets(listingId: string, formData: FormData) {
  const offices = parseWidgetJson<OfficeInput>(formData, "__offices");
  if (offices.length > 0) {
    await db.insert(listingOffices).values(
      offices.map((o) => ({
        listingId,
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
      products.map((p) => ({ listingId, name: p.name }))
    );
  }

  const degreesData = parseWidgetJson<DegreeInput>(formData, "__degrees");
  if (degreesData.length > 0) {
    await db.insert(personDegrees).values(
      degreesData.map((d) => ({
        listingId,
        institution: d.institution,
        subject: d.subject || null,
        degreeType: d.degreeType || null,
        graduationYear: d.graduationYear || null,
      }))
    );
  }

  const people = parseWidgetJson<PeopleInput>(formData, "__people");
  if (people.length > 0) {
    await db.insert(listingPeople).values(
      people.map((p) => ({
        listingId,
        name: p.name,
        title: p.title || null,
        role: p.role || null,
      }))
    );
  }

  const milestones = parseWidgetJson<MilestoneInput>(formData, "__milestones");
  if (milestones.length > 0) {
    await db.insert(listingMilestones).values(
      milestones.map((m) => ({
        listingId,
        title: m.title,
        description: m.description || null,
        date: m.date || null,
      }))
    );
  }

  const videos = parseWidgetJson<VideoInput>(formData, "__videos");
  if (videos.length > 0) {
    await db.insert(listingVideos).values(
      videos.map((v) => ({
        listingId,
        url: v.url,
        title: v.title || null,
      }))
    );
  }

  const tags = parseWidgetJson<TagInput>(formData, "__tags");
  if (tags.length > 0) {
    await db.insert(listingTags).values(
      tags.map((t) => ({ listingId, tag: t.tag }))
    );
  }

  const funding = parseWidgetJson<FundingInput>(formData, "__funding");
  if (funding.length > 0) {
    await db.insert(listingFunding).values(
      funding.map((f) => ({
        listingId,
        roundName: f.roundName || null,
        amount: f.amount || null,
        date: f.date || null,
        investors: f.investors || null,
      }))
    );
  }

  const acquisitions = parseWidgetJson<AcquisitionInput>(formData, "__acquisitions");
  if (acquisitions.length > 0) {
    await db.insert(listingAcquisitions).values(
      acquisitions.map((a) => ({
        listingId,
        acquiredCompany: a.acquiredCompany,
        date: a.date || null,
        price: a.price || null,
        description: a.description || null,
      }))
    );
  }

  const exits = parseWidgetJson<ExitInput>(formData, "__exits");
  if (exits.length > 0) {
    await db.insert(listingExits).values(
      exits.map((e) => ({
        listingId,
        exitType: e.exitType,
        date: e.date || null,
        amount: e.amount || null,
        acquirer: e.acquirer || null,
        description: e.description || null,
      }))
    );
  }

  const partners = parseWidgetJson<PartnerInput>(formData, "__partners");
  if (partners.length > 0) {
    await db.insert(listingPartners).values(
      partners.map((p) => ({
        listingId,
        partnerName: p.partnerName,
        description: p.description || null,
      }))
    );
  }

  const screenshots = parseWidgetJson<ScreenshotInput>(formData, "__screenshots");
  if (screenshots.length > 0) {
    await db.insert(listingScreenshots).values(
      screenshots.map((s) => ({
        listingId,
        imageUrl: s.imageUrl,
        caption: s.caption || null,
      }))
    );
  }

  const datacenterLinks = parseWidgetJson<DatacenterLinkInput>(formData, "__datacenterLinks");
  if (datacenterLinks.length > 0) {
    await db.insert(listingDatacenterLinks).values(
      datacenterLinks.map((d) => ({
        listingId,
        datacenterName: d.datacenterName,
      }))
    );
  }

  const newsItems = parseWidgetJson<NewsInput>(formData, "__news");
  if (newsItems.length > 0) {
    await db.insert(listingNews).values(
      newsItems.map((n) => ({
        listingId,
        title: n.title,
        url: n.url || null,
        source: n.source || null,
        date: n.date || null,
      }))
    );
  }

  const externalLinks = parseWidgetJson<ExternalLinkInput>(formData, "__externalLinks");
  if (externalLinks.length > 0) {
    await db.insert(listingExternalLinks).values(
      externalLinks.map((l) => ({
        listingId,
        title: l.title,
        url: l.url,
      }))
    );
  }

  const sources = parseWidgetJson<SourceInput>(formData, "__sources");
  if (sources.length > 0) {
    await db.insert(listingSources).values(
      sources.map((s) => ({
        listingId,
        title: s.title || null,
        url: s.url,
      }))
    );
  }

  const coupons = parseWidgetJson<CouponInput>(formData, "__coupons");
  if (coupons.length > 0) {
    await db.insert(listingCoupons).values(
      coupons.map((c) => ({
        listingId,
        code: c.code,
        discount: c.discount,
        expiresAt: c.expiresAt || null,
      }))
    );
  }

  const ipRanges = parseWidgetJson<IpRangeInput>(formData, "__ipRanges");
  if (ipRanges.length > 0) {
    await db.insert(listingIpRanges).values(
      ipRanges.map((r) => ({
        listingId,
        type: r.type,
        cidr: r.cidr,
        description: r.description || null,
      }))
    );
  }

  const controlPanels = parseWidgetJson<ControlPanelInput>(formData, "__controlPanels");
  if (controlPanels.length > 0) {
    await db.insert(listingControlPanels).values(
      controlPanels.map((c) => ({
        listingId,
        name: c.name,
        version: c.version || null,
        isDefault: c.isDefault ?? false,
      }))
    );
  }
}

function parseAllWidgets(formData: FormData) {
  return {
    offices: parseWidgetJson<OfficeInput>(formData, "__offices"),
    products: parseWidgetJson<ProductInput>(formData, "__products"),
    degrees: parseWidgetJson<DegreeInput>(formData, "__degrees"),
    people: parseWidgetJson<PeopleInput>(formData, "__people"),
    milestones: parseWidgetJson<MilestoneInput>(formData, "__milestones"),
    videos: parseWidgetJson<VideoInput>(formData, "__videos"),
    tags: parseWidgetJson<TagInput>(formData, "__tags"),
    funding: parseWidgetJson<FundingInput>(formData, "__funding"),
    acquisitions: parseWidgetJson<AcquisitionInput>(formData, "__acquisitions"),
    exits: parseWidgetJson<ExitInput>(formData, "__exits"),
    partners: parseWidgetJson<PartnerInput>(formData, "__partners"),
    screenshots: parseWidgetJson<ScreenshotInput>(formData, "__screenshots"),
    datacenterLinks: parseWidgetJson<DatacenterLinkInput>(formData, "__datacenterLinks"),
    news: parseWidgetJson<NewsInput>(formData, "__news"),
    externalLinks: parseWidgetJson<ExternalLinkInput>(formData, "__externalLinks"),
    sources: parseWidgetJson<SourceInput>(formData, "__sources"),
    coupons: parseWidgetJson<CouponInput>(formData, "__coupons"),
    ipRanges: parseWidgetJson<IpRangeInput>(formData, "__ipRanges"),
    controlPanels: parseWidgetJson<ControlPanelInput>(formData, "__controlPanels"),
  };
}

async function deleteAllWidgets(listingId: string) {
  await Promise.all([
    db.delete(listingOffices).where(eq(listingOffices.listingId, listingId)),
    db.delete(listingProducts).where(eq(listingProducts.listingId, listingId)),
    db.delete(personDegrees).where(eq(personDegrees.listingId, listingId)),
    db.delete(listingPeople).where(eq(listingPeople.listingId, listingId)),
    db.delete(listingMilestones).where(eq(listingMilestones.listingId, listingId)),
    db.delete(listingVideos).where(eq(listingVideos.listingId, listingId)),
    db.delete(listingTags).where(eq(listingTags.listingId, listingId)),
    db.delete(listingFunding).where(eq(listingFunding.listingId, listingId)),
    db.delete(listingAcquisitions).where(eq(listingAcquisitions.listingId, listingId)),
    db.delete(listingExits).where(eq(listingExits.listingId, listingId)),
    db.delete(listingPartners).where(eq(listingPartners.listingId, listingId)),
    db.delete(listingScreenshots).where(eq(listingScreenshots.listingId, listingId)),
    db.delete(listingDatacenterLinks).where(eq(listingDatacenterLinks.listingId, listingId)),
    db.delete(listingNews).where(eq(listingNews.listingId, listingId)),
    db.delete(listingExternalLinks).where(eq(listingExternalLinks.listingId, listingId)),
    db.delete(listingSources).where(eq(listingSources.listingId, listingId)),
    db.delete(listingCoupons).where(eq(listingCoupons.listingId, listingId)),
    db.delete(listingIpRanges).where(eq(listingIpRanges.listingId, listingId)),
    db.delete(listingControlPanels).where(eq(listingControlPanels.listingId, listingId)),
  ]);
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
    if (key.startsWith("__")) continue;
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
      numberOfDatacenters:
        typeof data.numberOfDatacenters === "number" ? data.numberOfDatacenters : undefined,
      totalSquareFootage: data.totalSquareFootage || null,
      blogFeedUrl: data.blogFeedUrl || null,
      stockTicker: data.stockTicker || null,
      asnNumber: data.asnNumber || null,
      greenEnergyCertified: data.greenEnergyCertified ?? false,
      greenEnergyDetails: data.greenEnergyDetails || null,
      uptimeGuarantee: data.uptimeGuarantee || null,
      companyStatus: data.companyStatus || null,
      approvalStatus,
      createdById: user?.id ?? null,
      createdByIp: !user ? ip : null,
    })
    .returning();

  await insertAllWidgets(listing.id, formData);

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
    if (key.startsWith("__")) continue;
    cleaned[key] = value === "" ? undefined : value;
  }

  const id = cleaned.id as string;
  if (!id) return { error: "Missing listing ID" };

  const existing = await getListingById(id);
  if (!existing) return { error: "Listing not found" };

  const autoApprove =
    user?.role === "admin" || user?.role === "moderator";

  // Build listing field updates
  const updateData: Record<string, unknown> = {};
  const fields = [
    "name", "legalName", "url", "phone", "email", "overview", "logoUrl",
    "foundingDate", "firstName", "lastName", "homepageUrl", "blogUrl",
    "blogFeedUrl", "twitterUsername", "linkedinUrl", "facebookUrl", "instagramUrl",
    "tiktokUrl", "birthplace", "birthdate", "photoUrl", "totalSquareFootage",
    "stockTicker", "asnNumber", "greenEnergyDetails", "uptimeGuarantee",
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
  if (cleaned.numberOfDatacenters !== undefined) {
    updateData.numberOfDatacenters = Number(cleaned.numberOfDatacenters) || null;
  }
  if (cleaned.companyStatus !== undefined) {
    updateData.companyStatus = (cleaned.companyStatus as string) || null;
  }
  if (cleaned.greenEnergyCertified !== undefined) {
    updateData.greenEnergyCertified = cleaned.greenEnergyCertified === "on" || cleaned.greenEnergyCertified === "true" || cleaned.greenEnergyCertified === true;
  }

  // Parse all widget data
  const widgetData = parseAllWidgets(formData);

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
    numberOfDatacenters: existing.numberOfDatacenters,
    companyStatus: existing.companyStatus,
    widgets: {
      offices: existing.offices,
      products: existing.products,
      degrees: existing.personDegrees,
      people: existing.people,
      milestones: existing.milestones,
      videos: existing.videos,
      tags: existing.tags,
      funding: existing.funding,
      acquisitions: existing.acquisitions,
      exits: existing.exits,
      partners: existing.partners,
      screenshots: existing.screenshots,
      datacenterLinks: existing.datacenterLinks,
      news: existing.news,
      externalLinks: existing.externalLinks,
      sources: existing.sources,
      coupons: existing.coupons,
      ipRanges: existing.ipRanges,
      controlPanels: existing.controlPanels,
    },
  };

  const afterSnapshot = {
    ...updateData,
    widgets: widgetData,
  };

  if (autoApprove) {
    updateData.updatedAt = new Date();
    await db.update(listings).set(updateData).where(eq(listings.id, id));

    // Delete all widgets and re-insert
    await deleteAllWidgets(id);
    await insertAllWidgets(id, formData);

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

  // Notify listing creator that someone edited their listing
  if (existing.createdById && user?.id) {
    await createNotification({
      userId: existing.createdById,
      type: "listing_edited",
      triggeredById: user.id,
      listingId: id,
    });
  }

  void ip;

  revalidatePath("/");
  return { success: true };
}
