import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import type { Category } from "@/types/listings";

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  category: Category;
  url: string | null;
  logoUrl: string | null;
  photoUrl: string | null;
  overview: string | null;
}

export interface GroupedSearchResults {
  company: SearchResult[];
  datacenter: SearchResult[];
  registrar: SearchResult[];
  person: SearchResult[];
  total: number;
}

export async function searchListings(
  query: string,
  limit = 20
): Promise<GroupedSearchResults> {
  const term = `%${query}%`;

  const results = await db
    .select({
      id: listings.id,
      name: listings.name,
      slug: listings.slug,
      category: listings.category,
      url: listings.url,
      logoUrl: listings.logoUrl,
      photoUrl: listings.photoUrl,
      overview: listings.overview,
    })
    .from(listings)
    .where(
      and(
        eq(listings.approvalStatus, "approved"),
        or(ilike(listings.name, term), ilike(listings.url, term))
      )
    )
    .orderBy(
      sql`CASE WHEN LOWER(${listings.name}) = LOWER(${query}) THEN 0
               WHEN LOWER(${listings.name}) LIKE LOWER(${query + "%"}) THEN 1
               ELSE 2 END`,
      listings.name
    )
    .limit(limit);

  const grouped: GroupedSearchResults = {
    company: [],
    datacenter: [],
    registrar: [],
    person: [],
    total: results.length,
  };

  for (const r of results) {
    grouped[r.category as Category].push(r as SearchResult);
  }

  return grouped;
}
