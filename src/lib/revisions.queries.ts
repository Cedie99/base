import { db } from "@/lib/db";
import { revisions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getRevisionsByListingId(listingId: string) {
  return db.query.revisions.findMany({
    where: eq(revisions.listingId, listingId),
    orderBy: [desc(revisions.createdAt)],
    with: {
      user: true,
    },
  });
}
