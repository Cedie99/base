"use server";

import { db } from "@/lib/db";
import {
  listingOffices,
  listingPeople,
  listingProducts,
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
  couponVotes,
  personDegrees,
} from "@/lib/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth.helpers";
import type { ActionState } from "@/lib/listings.actions";

// Generic widget CRUD helpers
async function requireEditor() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    throw new Error("Unauthorized");
  }
  return user;
}

// ── Offices ────────────────────────────────────────────────

export async function addOffice(data: {
  listingId: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isHq?: boolean;
  label?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingOffices).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add office" };
  }
}

export async function removeOffice(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingOffices).where(eq(listingOffices.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove office" };
  }
}

// ── People ─────────────────────────────────────────────────

export async function addPerson(data: {
  listingId: string;
  name: string;
  title?: string;
  role?: string;
  personListingId?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingPeople).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add person" };
  }
}

export async function removePerson(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingPeople).where(eq(listingPeople.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove person" };
  }
}

// ── Products ───────────────────────────────────────────────

export async function addProduct(data: {
  listingId: string;
  name: string;
  description?: string;
  isCustom?: boolean;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingProducts).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add product" };
  }
}

export async function removeProduct(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingProducts).where(eq(listingProducts.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove product" };
  }
}

// ── Milestones ─────────────────────────────────────────────

export async function addMilestone(data: {
  listingId: string;
  title: string;
  description?: string;
  date?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingMilestones).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add milestone" };
  }
}

export async function removeMilestone(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingMilestones).where(eq(listingMilestones.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove milestone" };
  }
}

// ── Videos ─────────────────────────────────────────────────

export async function addVideo(data: {
  listingId: string;
  url: string;
  title?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingVideos).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add video" };
  }
}

export async function removeVideo(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingVideos).where(eq(listingVideos.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove video" };
  }
}

// ── Tags ───────────────────────────────────────────────────

export async function addTag(data: {
  listingId: string;
  tag: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingTags).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add tag" };
  }
}

export async function removeTag(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingTags).where(eq(listingTags.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove tag" };
  }
}

// ── Funding ────────────────────────────────────────────────

export async function addFunding(data: {
  listingId: string;
  roundName?: string;
  amount?: string;
  date?: string;
  investors?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingFunding).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add funding" };
  }
}

export async function removeFunding(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingFunding).where(eq(listingFunding.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove funding" };
  }
}

// ── Acquisitions ───────────────────────────────────────────

export async function addAcquisition(data: {
  listingId: string;
  acquiredCompany: string;
  date?: string;
  price?: string;
  description?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingAcquisitions).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add acquisition" };
  }
}

export async function removeAcquisition(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db
      .delete(listingAcquisitions)
      .where(eq(listingAcquisitions.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove acquisition" };
  }
}

// ── Exits ──────────────────────────────────────────────────

export async function addExit(data: {
  listingId: string;
  exitType: string;
  date?: string;
  amount?: string;
  acquirer?: string;
  description?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingExits).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add exit" };
  }
}

export async function removeExit(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingExits).where(eq(listingExits.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove exit" };
  }
}

// ── Partners ───────────────────────────────────────────────

export async function addPartner(data: {
  listingId: string;
  partnerName: string;
  partnerListingId?: string;
  description?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingPartners).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add partner" };
  }
}

export async function removePartner(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingPartners).where(eq(listingPartners.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove partner" };
  }
}

// ── Screenshots ────────────────────────────────────────────

export async function addScreenshot(data: {
  listingId: string;
  imageUrl: string;
  caption?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingScreenshots).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add screenshot" };
  }
}

export async function removeScreenshot(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db
      .delete(listingScreenshots)
      .where(eq(listingScreenshots.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove screenshot" };
  }
}

// ── Datacenter Links ───────────────────────────────────────

export async function addDatacenterLink(data: {
  listingId: string;
  datacenterName: string;
  datacenterListingId?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingDatacenterLinks).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add datacenter link" };
  }
}

export async function removeDatacenterLink(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db
      .delete(listingDatacenterLinks)
      .where(eq(listingDatacenterLinks.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove datacenter link" };
  }
}

// ── News ───────────────────────────────────────────────────

export async function addNews(data: {
  listingId: string;
  title: string;
  url?: string;
  source?: string;
  date?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingNews).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add news" };
  }
}

export async function removeNews(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingNews).where(eq(listingNews.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove news" };
  }
}

// ── External Links ─────────────────────────────────────────

export async function addExternalLink(data: {
  listingId: string;
  title: string;
  url: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingExternalLinks).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add external link" };
  }
}

export async function removeExternalLink(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db
      .delete(listingExternalLinks)
      .where(eq(listingExternalLinks.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove external link" };
  }
}

// ── Sources ────────────────────────────────────────────────

export async function addSource(data: {
  listingId: string;
  title?: string;
  url: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingSources).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add source" };
  }
}

export async function removeSource(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingSources).where(eq(listingSources.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove source" };
  }
}

// ── Coupons ────────────────────────────────────────────────

export async function addCoupon(data: {
  listingId: string;
  code: string;
  discount: string;
  expiresAt?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(listingCoupons).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add coupon" };
  }
}

export async function removeCoupon(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(listingCoupons).where(eq(listingCoupons.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove coupon" };
  }
}

async function getVoterIdentity() {
  const user = await getCurrentUser();
  if (user) {
    return { userId: user.id, voterIp: null };
  }
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";
  return { userId: null, voterIp: ip };
}

export async function voteCoupon(
  couponId: string,
  vote: "yes" | "no"
): Promise<ActionState & { alreadyVoted?: boolean }> {
  try {
    const { userId, voterIp } = await getVoterIdentity();

    // Check for existing vote
    const existing = await db
      .select({ id: couponVotes.id })
      .from(couponVotes)
      .where(
        userId
          ? and(
              eq(couponVotes.couponId, couponId),
              eq(couponVotes.userId, userId)
            )
          : and(
              eq(couponVotes.couponId, couponId),
              eq(couponVotes.voterIp, voterIp!)
            )
      )
      .limit(1);

    if (existing.length > 0) {
      return { alreadyVoted: true, error: "Already voted" };
    }

    // Insert vote record and increment count atomically
    await db.insert(couponVotes).values({
      couponId,
      userId,
      voterIp,
      vote,
    });

    if (vote === "yes") {
      await db
        .update(listingCoupons)
        .set({ votesYes: sql`${listingCoupons.votesYes} + 1` })
        .where(eq(listingCoupons.id, couponId));
    } else {
      await db
        .update(listingCoupons)
        .set({ votesNo: sql`${listingCoupons.votesNo} + 1` })
        .where(eq(listingCoupons.id, couponId));
    }

    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to record vote" };
  }
}

export async function getCouponVotes(
  couponIds: string[]
): Promise<Record<string, "yes" | "no">> {
  if (couponIds.length === 0) return {};

  const { userId, voterIp } = await getVoterIdentity();

  const rows = await db
    .select({
      couponId: couponVotes.couponId,
      vote: couponVotes.vote,
    })
    .from(couponVotes)
    .where(
      userId
        ? and(
            inArray(couponVotes.couponId, couponIds),
            eq(couponVotes.userId, userId)
          )
        : and(
            inArray(couponVotes.couponId, couponIds),
            eq(couponVotes.voterIp, voterIp!)
          )
    );

  const result: Record<string, "yes" | "no"> = {};
  for (const row of rows) {
    result[row.couponId] = row.vote as "yes" | "no";
  }
  return result;
}

// ── Person Degrees ─────────────────────────────────────────

export async function addDegree(data: {
  listingId: string;
  institution: string;
  subject?: string;
  degreeType?: string;
  graduationYear?: string;
}): Promise<ActionState> {
  try {
    await requireEditor();
    await db.insert(personDegrees).values(data);
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to add degree" };
  }
}

export async function removeDegree(id: string): Promise<ActionState> {
  try {
    await requireEditor();
    await db.delete(personDegrees).where(eq(personDegrees.id, id));
    revalidatePath("/dashboard/listings");
    return { success: true };
  } catch {
    return { error: "Failed to remove degree" };
  }
}
