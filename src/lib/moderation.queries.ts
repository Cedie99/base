import { db } from "@/lib/db";
import { listings, revisions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getPendingSubmissions() {
  return db.query.listings.findMany({
    where: eq(listings.approvalStatus, "pending"),
    orderBy: [desc(listings.createdAt)],
  });
}

export async function getRejectedSubmissions() {
  return db.query.listings.findMany({
    where: eq(listings.approvalStatus, "rejected"),
    orderBy: [desc(listings.updatedAt)],
  });
}

export async function getPendingRevisions() {
  return db.query.revisions.findMany({
    where: and(
      eq(revisions.approvalStatus, "pending"),
      eq(revisions.action, "update")
    ),
    with: {
      user: true,
      listing: true,
    },
    orderBy: [desc(revisions.createdAt)],
  });
}
