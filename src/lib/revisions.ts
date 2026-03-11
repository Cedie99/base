import { db } from "@/lib/db";
import { revisions } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth.helpers";
import { headers } from "next/headers";

interface CreateRevisionParams {
  listingId: string;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  approvalStatus?: "pending" | "approved" | "rejected";
}

export async function createRevision(params: CreateRevisionParams) {
  const user = await getCurrentUser();
  let userIp: string | null = null;

  if (!user) {
    const headerList = await headers();
    userIp =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerList.get("x-real-ip") ??
      null;
  }

  const [revision] = await db
    .insert(revisions)
    .values({
      listingId: params.listingId,
      userId: user?.id ?? null,
      userIp,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      before: params.before ?? null,
      after: params.after ?? null,
      approvalStatus: params.approvalStatus ?? "approved",
    })
    .returning();

  return revision;
}
