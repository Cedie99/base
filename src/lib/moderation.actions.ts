"use server";

import { db } from "@/lib/db";
import {
  listings,
  revisions,
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
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireModerator } from "@/lib/auth.helpers";
import { createNotification } from "@/lib/notifications.helpers";
import type { ActionState } from "@/lib/listings.actions";

export async function approveListing(id: string): Promise<ActionState> {
  try {
    const user = await requireModerator();

    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, id),
      columns: { createdById: true },
    });

    await db
      .update(listings)
      .set({ approvalStatus: "approved", updatedAt: new Date() })
      .where(eq(listings.id, id));

    if (listing?.createdById) {
      await createNotification({
        userId: listing.createdById,
        type: "listing_approved",
        triggeredById: user.id,
        listingId: id,
      });
    }

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
    const user = await requireModerator();

    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, id),
      columns: { createdById: true },
    });

    await db
      .update(listings)
      .set({ approvalStatus: "rejected", updatedAt: new Date() })
      .where(eq(listings.id, id));

    if (listing?.createdById) {
      await createNotification({
        userId: listing.createdById,
        type: "listing_rejected",
        triggeredById: user.id,
        listingId: id,
      });
    }

    revalidatePath("/dashboard/moderation");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reject listing";
    return { error: message };
  }
}

// Helper: delete all widget rows for a listing, then re-insert from snapshot
async function applyWidgetSnapshot(
  listingId: string,
  w: Record<string, unknown>
) {
  // Delete all existing widget data
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
  ]);

  // Re-insert from snapshot
  if (Array.isArray(w.offices) && w.offices.length > 0) {
    await db.insert(listingOffices).values(
      w.offices.map((o: Record<string, unknown>) => ({
        listingId,
        address: o.address as string,
        city: (o.city as string) || null,
        state: (o.state as string) || null,
        country: (o.country as string) || null,
        postalCode: (o.postalCode as string) || null,
        isHq: (o.isHq as boolean) ?? false,
      }))
    );
  }

  if (Array.isArray(w.products) && w.products.length > 0) {
    await db.insert(listingProducts).values(
      w.products.map((p: Record<string, unknown>) => ({
        listingId,
        name: p.name as string,
      }))
    );
  }

  if (Array.isArray(w.degrees) && w.degrees.length > 0) {
    await db.insert(personDegrees).values(
      w.degrees.map((d: Record<string, unknown>) => ({
        listingId,
        institution: d.institution as string,
        subject: (d.subject as string) || null,
        degreeType: (d.degreeType as string) || null,
        graduationYear: (d.graduationYear as string) || null,
      }))
    );
  }

  if (Array.isArray(w.people) && w.people.length > 0) {
    await db.insert(listingPeople).values(
      w.people.map((p: Record<string, unknown>) => ({
        listingId,
        name: p.name as string,
        title: (p.title as string) || null,
        role: (p.role as string) || null,
      }))
    );
  }

  if (Array.isArray(w.milestones) && w.milestones.length > 0) {
    await db.insert(listingMilestones).values(
      w.milestones.map((m: Record<string, unknown>) => ({
        listingId,
        title: m.title as string,
        description: (m.description as string) || null,
        date: (m.date as string) || null,
      }))
    );
  }

  if (Array.isArray(w.videos) && w.videos.length > 0) {
    await db.insert(listingVideos).values(
      w.videos.map((v: Record<string, unknown>) => ({
        listingId,
        url: v.url as string,
        title: (v.title as string) || null,
      }))
    );
  }

  if (Array.isArray(w.tags) && w.tags.length > 0) {
    await db.insert(listingTags).values(
      w.tags.map((t: Record<string, unknown>) => ({
        listingId,
        tag: t.tag as string,
      }))
    );
  }

  if (Array.isArray(w.funding) && w.funding.length > 0) {
    await db.insert(listingFunding).values(
      w.funding.map((f: Record<string, unknown>) => ({
        listingId,
        roundName: (f.roundName as string) || null,
        amount: (f.amount as string) || null,
        date: (f.date as string) || null,
        investors: (f.investors as string) || null,
      }))
    );
  }

  if (Array.isArray(w.acquisitions) && w.acquisitions.length > 0) {
    await db.insert(listingAcquisitions).values(
      w.acquisitions.map((a: Record<string, unknown>) => ({
        listingId,
        acquiredCompany: a.acquiredCompany as string,
        date: (a.date as string) || null,
        price: (a.price as string) || null,
        description: (a.description as string) || null,
      }))
    );
  }

  if (Array.isArray(w.exits) && w.exits.length > 0) {
    await db.insert(listingExits).values(
      w.exits.map((e: Record<string, unknown>) => ({
        listingId,
        exitType: e.exitType as string,
        date: (e.date as string) || null,
        amount: (e.amount as string) || null,
        acquirer: (e.acquirer as string) || null,
        description: (e.description as string) || null,
      }))
    );
  }

  if (Array.isArray(w.partners) && w.partners.length > 0) {
    await db.insert(listingPartners).values(
      w.partners.map((p: Record<string, unknown>) => ({
        listingId,
        partnerName: p.partnerName as string,
        description: (p.description as string) || null,
      }))
    );
  }

  if (Array.isArray(w.screenshots) && w.screenshots.length > 0) {
    await db.insert(listingScreenshots).values(
      w.screenshots.map((s: Record<string, unknown>) => ({
        listingId,
        imageUrl: s.imageUrl as string,
        caption: (s.caption as string) || null,
      }))
    );
  }

  if (Array.isArray(w.datacenterLinks) && w.datacenterLinks.length > 0) {
    await db.insert(listingDatacenterLinks).values(
      w.datacenterLinks.map((d: Record<string, unknown>) => ({
        listingId,
        datacenterName: d.datacenterName as string,
      }))
    );
  }

  if (Array.isArray(w.news) && w.news.length > 0) {
    await db.insert(listingNews).values(
      w.news.map((n: Record<string, unknown>) => ({
        listingId,
        title: n.title as string,
        url: (n.url as string) || null,
        source: (n.source as string) || null,
        date: (n.date as string) || null,
      }))
    );
  }

  if (Array.isArray(w.externalLinks) && w.externalLinks.length > 0) {
    await db.insert(listingExternalLinks).values(
      w.externalLinks.map((l: Record<string, unknown>) => ({
        listingId,
        title: l.title as string,
        url: l.url as string,
      }))
    );
  }

  if (Array.isArray(w.sources) && w.sources.length > 0) {
    await db.insert(listingSources).values(
      w.sources.map((s: Record<string, unknown>) => ({
        listingId,
        title: (s.title as string) || null,
        url: s.url as string,
      }))
    );
  }

  if (Array.isArray(w.coupons) && w.coupons.length > 0) {
    await db.insert(listingCoupons).values(
      w.coupons.map((c: Record<string, unknown>) => ({
        listingId,
        code: c.code as string,
        discount: c.discount as string,
        expiresAt: (c.expiresAt as string) || null,
      }))
    );
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

    const after = revision.after as Record<string, unknown> | null;
    if (!after) return { error: "Revision has no changes to apply" };

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
      await applyWidgetSnapshot(
        revision.listingId,
        widgets as Record<string, unknown>
      );
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

    if (revision.userId) {
      await createNotification({
        userId: revision.userId,
        type: "revision_approved",
        triggeredById: user.id,
        listingId: revision.listingId,
        revisionId: revision.id,
      });
    }

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

    if (revision.userId) {
      await createNotification({
        userId: revision.userId,
        type: "revision_rejected",
        triggeredById: user.id,
        listingId: revision.listingId,
        revisionId: revision.id,
      });
    }

    revalidatePath("/dashboard/moderation");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to reject revision";
    return { error: message };
  }
}
