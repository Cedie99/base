import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import type { NotificationType } from "@/types/discussions";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  triggeredById: string;
  threadId?: string;
  commentId?: string;
  listingId?: string;
  revisionId?: string;
}

export async function createNotification({
  userId,
  type,
  triggeredById,
  threadId,
  commentId,
  listingId,
  revisionId,
}: CreateNotificationParams) {
  // Skip self-notifications
  if (userId === triggeredById) return;

  await db.insert(notifications).values({
    userId,
    type,
    triggeredById,
    threadId: threadId ?? null,
    commentId: commentId ?? null,
    listingId: listingId ?? null,
    revisionId: revisionId ?? null,
  });
}
