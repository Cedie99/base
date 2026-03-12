import type {
  discussionThreads,
  discussionComments,
  notifications,
} from "@/lib/db/schema";

export type DiscussionThread = typeof discussionThreads.$inferSelect;
export type DiscussionComment = typeof discussionComments.$inferSelect;

export type ThreadWithAuthor = DiscussionThread & {
  createdBy: { id: string; name: string | null; image: string | null };
  listing?: { name: string; slug: string; category: string } | null;
};

export type CommentWithAuthor = DiscussionComment & {
  createdBy: { id: string; name: string | null; image: string | null };
  replies?: CommentWithAuthor[];
};

export type ThreadWithComments = ThreadWithAuthor & {
  comments: CommentWithAuthor[];
};

export type Notification = typeof notifications.$inferSelect;

export type NotificationType =
  | "thread_reply"
  | "comment_reply"
  | "listing_approved"
  | "listing_rejected"
  | "revision_approved"
  | "revision_rejected"
  | "listing_edited"
  | "listing_discussion";

export type NotificationWithDetails = Notification & {
  thread: { id: string; title: string } | null;
  triggeredBy: { id: string; name: string | null; image: string | null };
  listing: { id: string; name: string; slug: string; category: string } | null;
};
