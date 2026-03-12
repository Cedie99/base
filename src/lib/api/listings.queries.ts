import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq, and, count, ilike, desc } from "drizzle-orm";
import type { Category } from "@/types/listings";

function stripInternalFields(listing: Record<string, unknown>) {
  const { createdById, createdByIp, ...rest } = listing;
  return rest;
}

export async function getApiListings({
  category,
  page = 1,
  perPage = 20,
}: {
  category?: Category;
  page?: number;
  perPage?: number;
}) {
  const conditions = [eq(listings.approvalStatus, "approved")];
  if (category) conditions.push(eq(listings.category, category));

  const where = and(...conditions);

  const [data, [{ total }]] = await Promise.all([
    db.query.listings.findMany({
      where,
      orderBy: [desc(listings.updatedAt)],
      limit: perPage,
      offset: (page - 1) * perPage,
    }),
    db.select({ total: count() }).from(listings).where(where),
  ]);

  return {
    data: data.map(stripInternalFields),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function searchApiListings(
  query: string,
  page = 1,
  perPage = 20
) {
  const where = and(
    eq(listings.approvalStatus, "approved"),
    ilike(listings.name, `%${query}%`)
  );

  const [data, [{ total }]] = await Promise.all([
    db.query.listings.findMany({
      where,
      orderBy: [desc(listings.updatedAt)],
      limit: perPage,
      offset: (page - 1) * perPage,
    }),
    db.select({ total: count() }).from(listings).where(where),
  ]);

  return {
    data: data.map(stripInternalFields),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}
