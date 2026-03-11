import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq, and, desc, count, ilike, sql } from "drizzle-orm";
import type { Category, ApprovalStatus } from "@/types/listings";

export async function getListingById(id: string) {
  return db.query.listings.findFirst({
    where: eq(listings.id, id),
    with: {
      offices: true,
      people: true,
      products: true,
      milestones: true,
      videos: true,
      tags: true,
      funding: true,
      acquisitions: true,
      exits: true,
      partners: true,
      screenshots: true,
      datacenterLinks: true,
      news: true,
      externalLinks: true,
      sources: true,
      coupons: true,
      personDegrees: true,
    },
  });
}

export async function getListingBySlug(category: Category, slug: string) {
  return db.query.listings.findFirst({
    where: and(eq(listings.category, category), eq(listings.slug, slug)),
    with: {
      offices: true,
      people: true,
      products: true,
      milestones: true,
      videos: true,
      tags: true,
      funding: true,
      acquisitions: true,
      exits: true,
      partners: true,
      screenshots: true,
      datacenterLinks: true,
      news: true,
      externalLinks: true,
      sources: true,
      coupons: true,
      personDegrees: true,
    },
  });
}

export async function getPublicListingBySlug(category: Category, slug: string) {
  return db.query.listings.findFirst({
    where: and(
      eq(listings.category, category),
      eq(listings.slug, slug),
      eq(listings.approvalStatus, "approved")
    ),
    with: {
      offices: true,
      people: true,
      products: true,
      milestones: true,
      videos: true,
      tags: true,
      funding: true,
      acquisitions: true,
      exits: true,
      partners: true,
      screenshots: true,
      datacenterLinks: true,
      news: true,
      externalLinks: true,
      sources: true,
      coupons: true,
      personDegrees: true,
    },
  });
}

export async function getAllListings(filters?: {
  category?: Category;
  status?: ApprovalStatus;
  search?: string;
}) {
  const conditions = [];

  if (filters?.category) {
    conditions.push(eq(listings.category, filters.category));
  }
  if (filters?.status) {
    conditions.push(eq(listings.approvalStatus, filters.status));
  }
  if (filters?.search) {
    conditions.push(ilike(listings.name, `%${filters.search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.listings.findMany({
    where,
    orderBy: [desc(listings.updatedAt)],
  });
}

export async function getPublicListingsByCategory(category: Category) {
  return db.query.listings.findMany({
    where: and(
      eq(listings.category, category),
      eq(listings.approvalStatus, "approved")
    ),
    orderBy: [desc(listings.updatedAt)],
  });
}

export async function getCategoryCounts() {
  const result = await db
    .select({
      category: listings.category,
      count: count(),
    })
    .from(listings)
    .where(eq(listings.approvalStatus, "approved"))
    .groupBy(listings.category);

  const counts: Record<string, number> = {
    company: 0,
    datacenter: 0,
    registrar: 0,
    person: 0,
  };

  for (const row of result) {
    counts[row.category] = row.count;
  }

  return counts;
}

export async function getRecentListings(limit = 10) {
  return db.query.listings.findMany({
    where: eq(listings.approvalStatus, "approved"),
    orderBy: [desc(listings.updatedAt)],
    limit,
  });
}

export async function getPendingListings() {
  return db.query.listings.findMany({
    where: eq(listings.approvalStatus, "pending"),
    orderBy: [desc(listings.createdAt)],
    with: {
      createdBy: true,
    },
  });
}

export async function checkSlugExists(
  category: Category,
  slug: string,
  excludeId?: string
) {
  const existing = await db.query.listings.findFirst({
    where: excludeId
      ? and(
          eq(listings.category, category),
          eq(listings.slug, slug),
          sql`${listings.id} != ${excludeId}`
        )
      : and(eq(listings.category, category), eq(listings.slug, slug)),
  });
  return !!existing;
}
