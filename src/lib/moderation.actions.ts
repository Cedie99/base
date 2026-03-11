"use server";

import { db } from "@/lib/db";
import {
  listings,
  revisions,
  listingOffices,
  listingProducts,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireModerator } from "@/lib/auth.helpers";
import type { ActionState } from "@/lib/listings.actions";

export async function approveListing(id: string): Promise<ActionState> {
  try {
    await requireModerator();
    await db
      .update(listings)
      .set({ approvalStatus: "approved", updatedAt: new Date() })
      .where(eq(listings.id, id));
    revalidatePath("/dashboard/moderation");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to approve listing";
    return { error: message };
  }
}

export async function rejectListing(id: string): Promise<ActionState> {
  try {
    await requireModerator();
    await db
      .update(listings)
      .set({ approvalStatus: "rejected", updatedAt: new Date() })
      .where(eq(listings.id, id));
    revalidatePath("/dashboard/moderation");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reject listing";
    return { error: message };
  }
}

export async function approveRevision(revisionId: string): Promise<ActionState> {
  try {
    const user = await requireModerator();

    const revision = await db.query.revisions.findFirst({
      where: eq(revisions.id, revisionId),
    });
    if (!revision) return { error: "Revision not found" };
    if (revision.approvalStatus !== "pending") {
      return { error: "Revision is not pending" };
    }

    // Read the `after` snapshot
    const after = revision.after as Record<string, unknown> | null;
    if (!after) return { error: "Revision has no changes to apply" };

    // Separate widgets from listing fields
    const { widgets, ...listingFields } = after;

    // Update listing fields
    const updateData: Record<string, unknown> = { ...listingFields };
    updateData.updatedAt = new Date();
    await db
      .update(listings)
      .set(updateData)
      .where(eq(listings.id, revision.listingId));

    // Apply widget changes
    if (widgets && typeof widgets === "object") {
      const w = widgets as Record<string, unknown>;

      if (Array.isArray(w.offices)) {
        await db
          .delete(listingOffices)
          .where(eq(listingOffices.listingId, revision.listingId));
        if (w.offices.length > 0) {
          await db.insert(listingOffices).values(
            w.offices.map(
              (o: {
                address: string;
                city?: string;
                state?: string;
                country?: string;
                postalCode?: string;
                isHq?: boolean;
              }) => ({
                listingId: revision.listingId,
                address: o.address,
                city: o.city || null,
                state: o.state || null,
                country: o.country || null,
                postalCode: o.postalCode || null,
                isHq: o.isHq ?? false,
              })
            )
          );
        }
      }

      if (Array.isArray(w.products)) {
        await db
          .delete(listingProducts)
          .where(eq(listingProducts.listingId, revision.listingId));
        if (w.products.length > 0) {
          await db.insert(listingProducts).values(
            w.products.map((p: { name: string }) => ({
              listingId: revision.listingId,
              name: p.name,
            }))
          );
        }
      }
    }

    // Mark revision as approved
    await db
      .update(revisions)
      .set({
        approvalStatus: "approved",
        moderatedById: user.id,
        moderatedAt: new Date(),
      })
      .where(eq(revisions.id, revisionId));

    revalidatePath("/dashboard/moderation");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to approve revision";
    return { error: message };
  }
}

export async function rejectRevision(revisionId: string): Promise<ActionState> {
  try {
    const user = await requireModerator();

    const revision = await db.query.revisions.findFirst({
      where: eq(revisions.id, revisionId),
    });
    if (!revision) return { error: "Revision not found" };
    if (revision.approvalStatus !== "pending") {
      return { error: "Revision is not pending" };
    }

    await db
      .update(revisions)
      .set({
        approvalStatus: "rejected",
        moderatedById: user.id,
        moderatedAt: new Date(),
      })
      .where(eq(revisions.id, revisionId));

    revalidatePath("/dashboard/moderation");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reject revision";
    return { error: message };
  }
}
