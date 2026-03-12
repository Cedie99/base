"use server";

import { db } from "@/lib/db";
import {
  discussionThreads,
  discussionComments,
  listings,
  notifications,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth.helpers";
import { createNotification } from "@/lib/notifications.helpers";
import {
  createThreadSchema,
  createCommentSchema,
} from "@/lib/validations/discussions";
import type { ActionState } from "@/lib/listings.actions";

export async function createThread(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in to create a thread" };

  const raw = {
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    listingId: (formData.get("listingId") as string) || undefined,
  };

  const parsed = createThreadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [thread] = await db
    .insert(discussionThreads)
    .values({
      title: parsed.data.title,
      body: parsed.data.body,
      listingId: parsed.data.listingId ?? null,
      createdById: user.id,
    })
    .returning();

  // Notify listing creator about new discussion on their listing
  if (parsed.data.listingId) {
    const listing = await db.query.listings.findFirst({
      where: eq(listings.id, parsed.data.listingId),
      columns: { createdById: true },
    });

    if (listing?.createdById) {
      await createNotification({
        userId: listing.createdById,
        type: "listing_discussion",
        triggeredById: user.id,
        threadId: thread.id,
        listingId: parsed.data.listingId,
      });
    }
  }

  revalidatePath("/discussions");
  if (parsed.data.listingId) {
    revalidatePath("/");
  }

  return { success: true, id: thread.id };
}

export async function createComment(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in to comment" };

  const raw = {
    body: formData.get("body") as string,
    threadId: formData.get("threadId") as string,
    parentCommentId: (formData.get("parentCommentId") as string) || undefined,
  };

  const parsed = createCommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check thread exists and is not locked
  const thread = await db.query.discussionThreads.findFirst({
    where: eq(discussionThreads.id, parsed.data.threadId),
  });

  if (!thread) return { error: "Thread not found" };
  if (thread.isLocked) return { error: "This thread is locked" };

  const [comment] = await db
    .insert(discussionComments)
    .values({
      threadId: parsed.data.threadId,
      parentCommentId: parsed.data.parentCommentId ?? null,
      body: parsed.data.body,
      createdById: user.id,
    })
    .returning();

  // Update thread comment count and last activity
  await db
    .update(discussionThreads)
    .set({
      commentCount: sql`${discussionThreads.commentCount} + 1`,
      lastActivityAt: new Date(),
    })
    .where(eq(discussionThreads.id, parsed.data.threadId));

  // ── Trigger notifications ──────────────────────────────────
  const notifiedUserIds = new Set<string>();

  // 1. Notify thread author (if commenter ≠ thread author)
  if (thread.createdById !== user.id) {
    notifiedUserIds.add(thread.createdById);
    await db.insert(notifications).values({
      userId: thread.createdById,
      type: "thread_reply",
      threadId: thread.id,
      commentId: comment.id,
      triggeredById: user.id,
    });
  }

  // 2. If replying to a comment, notify parent comment author
  if (parsed.data.parentCommentId) {
    const parentComment = await db.query.discussionComments.findFirst({
      where: eq(discussionComments.id, parsed.data.parentCommentId),
      columns: { createdById: true },
    });

    if (
      parentComment &&
      parentComment.createdById !== user.id &&
      !notifiedUserIds.has(parentComment.createdById)
    ) {
      await db.insert(notifications).values({
        userId: parentComment.createdById,
        type: "comment_reply",
        threadId: thread.id,
        commentId: comment.id,
        triggeredById: user.id,
      });
    }
  }

  revalidatePath(`/discussions/${parsed.data.threadId}`);

  return { success: true };
}

export async function deleteComment(commentId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const comment = await db.query.discussionComments.findFirst({
    where: eq(discussionComments.id, commentId),
  });

  if (!comment) return { error: "Comment not found" };

  const canDelete =
    comment.createdById === user.id ||
    user.role === "admin" ||
    user.role === "moderator";

  if (!canDelete) return { error: "Forbidden" };

  await db
    .delete(discussionComments)
    .where(eq(discussionComments.id, commentId));

  // Decrement comment count
  await db
    .update(discussionThreads)
    .set({
      commentCount: sql`GREATEST(${discussionThreads.commentCount} - 1, 0)`,
    })
    .where(eq(discussionThreads.id, comment.threadId));

  revalidatePath(`/discussions/${comment.threadId}`);

  return { success: true };
}

export async function deleteThread(threadId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const thread = await db.query.discussionThreads.findFirst({
    where: eq(discussionThreads.id, threadId),
  });

  if (!thread) return { error: "Thread not found" };

  const canDelete =
    thread.createdById === user.id ||
    user.role === "admin" ||
    user.role === "moderator";

  if (!canDelete) return { error: "Forbidden" };

  await db
    .delete(discussionThreads)
    .where(eq(discussionThreads.id, threadId));

  revalidatePath("/discussions");

  return { success: true };
}

export async function togglePinThread(threadId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };
  if (user.role !== "admin" && user.role !== "moderator") {
    return { error: "Forbidden" };
  }

  const thread = await db.query.discussionThreads.findFirst({
    where: eq(discussionThreads.id, threadId),
  });

  if (!thread) return { error: "Thread not found" };

  await db
    .update(discussionThreads)
    .set({ isPinned: !thread.isPinned })
    .where(eq(discussionThreads.id, threadId));

  revalidatePath(`/discussions/${threadId}`);
  revalidatePath("/discussions");

  return { success: true };
}

export async function toggleLockThread(threadId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };
  if (user.role !== "admin" && user.role !== "moderator") {
    return { error: "Forbidden" };
  }

  const thread = await db.query.discussionThreads.findFirst({
    where: eq(discussionThreads.id, threadId),
  });

  if (!thread) return { error: "Thread not found" };

  await db
    .update(discussionThreads)
    .set({ isLocked: !thread.isLocked })
    .where(eq(discussionThreads.id, threadId));

  revalidatePath(`/discussions/${threadId}`);
  revalidatePath("/discussions");

  return { success: true };
}
