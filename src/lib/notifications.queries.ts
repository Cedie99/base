import { db } from "@/lib/db";
import {
  notifications,
  discussionThreads,
  discussionComments,
} from "@/lib/db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import type { NotificationWithDetails } from "@/types/discussions";

export async function getUnreadCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );

  return result?.count ?? 0;
}

export async function getNotifications(
  userId: string,
  limit = 20
): Promise<NotificationWithDetails[]> {
  const results = await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
    with: {
      thread: {
        columns: { id: true, title: true },
      },
      listing: {
        columns: { id: true, name: true, slug: true, category: true },
      },
      triggeredBy: {
        columns: { id: true, name: true, image: true },
      },
    },
  });

  return results as NotificationWithDetails[];
}

export async function getUserDiscussionStats(userId: string) {
  const [threadsResult] = await db
    .select({ count: count() })
    .from(discussionThreads)
    .where(eq(discussionThreads.createdById, userId));

  const [commentsResult] = await db
    .select({ count: count() })
    .from(discussionComments)
    .where(eq(discussionComments.createdById, userId));

  const [repliesResult] = await db
    .select({ count: count() })
    .from(notifications)
    .where(eq(notifications.userId, userId));

  return {
    threadsCreated: threadsResult?.count ?? 0,
    commentsPosted: commentsResult?.count ?? 0,
    totalRepliesReceived: repliesResult?.count ?? 0,
  };
}

export async function getUserRecentThreads(userId: string, limit = 5) {
  return db.query.discussionThreads.findMany({
    where: eq(discussionThreads.createdById, userId),
    orderBy: [desc(discussionThreads.lastActivityAt)],
    limit,
    columns: {
      id: true,
      title: true,
      commentCount: true,
      lastActivityAt: true,
    },
  });
}
