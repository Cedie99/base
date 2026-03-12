import { db } from "@/lib/db";
import { discussionThreads, discussionComments } from "@/lib/db/schema";
import { eq, isNull, desc, count, and, asc } from "drizzle-orm";
import type { ThreadWithAuthor, ThreadWithComments } from "@/types/discussions";

export async function getThreads(
  page = 1,
  perPage = 20
): Promise<ThreadWithAuthor[]> {
  return db.query.discussionThreads.findMany({
    where: isNull(discussionThreads.listingId),
    orderBy: [
      desc(discussionThreads.isPinned),
      desc(discussionThreads.lastActivityAt),
    ],
    limit: perPage,
    offset: (page - 1) * perPage,
    with: {
      createdBy: {
        columns: { id: true, name: true, image: true },
      },
    },
  }) as Promise<ThreadWithAuthor[]>;
}

export async function getListingThreads(
  listingId: string
): Promise<ThreadWithAuthor[]> {
  return db.query.discussionThreads.findMany({
    where: eq(discussionThreads.listingId, listingId),
    orderBy: [
      desc(discussionThreads.isPinned),
      desc(discussionThreads.lastActivityAt),
    ],
    with: {
      createdBy: {
        columns: { id: true, name: true, image: true },
      },
    },
  }) as Promise<ThreadWithAuthor[]>;
}

export async function getThreadById(
  threadId: string
): Promise<ThreadWithComments | null> {
  const thread = await db.query.discussionThreads.findFirst({
    where: eq(discussionThreads.id, threadId),
    with: {
      createdBy: {
        columns: { id: true, name: true, image: true },
      },
      listing: {
        columns: { name: true, slug: true, category: true },
      },
      comments: {
        where: isNull(discussionComments.parentCommentId),
        orderBy: [asc(discussionComments.createdAt)],
        with: {
          createdBy: {
            columns: { id: true, name: true, image: true },
          },
          replies: {
            orderBy: [asc(discussionComments.createdAt)],
            with: {
              createdBy: {
                columns: { id: true, name: true, image: true },
              },
            },
          },
        },
      },
    },
  });

  return (thread as ThreadWithComments) ?? null;
}

export async function getThreadCount(listingId?: string): Promise<number> {
  const conditions = listingId
    ? eq(discussionThreads.listingId, listingId)
    : isNull(discussionThreads.listingId);

  const [result] = await db
    .select({ count: count() })
    .from(discussionThreads)
    .where(conditions);

  return result?.count ?? 0;
}
