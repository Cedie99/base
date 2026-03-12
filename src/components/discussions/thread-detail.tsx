import { Pin, Lock } from "lucide-react";
import { ThreadActions } from "./thread-actions";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { TimeAgo } from "@/components/ui/time-ago";
import type { ThreadWithComments } from "@/types/discussions";
import Link from "next/link";

interface ThreadDetailProps {
  thread: ThreadWithComments;
  currentUserId?: string;
  currentUserRole?: string;
}

export function ThreadDetail({
  thread,
  currentUserId,
  currentUserRole,
}: ThreadDetailProps) {
  const canModerate =
    currentUserRole === "admin" || currentUserRole === "moderator";
  const canDelete =
    canModerate || currentUserId === thread.createdById;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/discussions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        &larr; Back to discussions
      </Link>

      {/* Thread header */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {thread.isPinned && (
                <Pin className="h-4 w-4 shrink-0 text-amber-500" />
              )}
              {thread.isLocked && (
                <Lock className="h-4 w-4 shrink-0 text-neutral-400" />
              )}
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                {thread.title}
              </h1>
            </div>
            {thread.listing && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Discussion on{" "}
                <Link
                  href={`/${thread.listing.category}/${thread.listing.slug}`}
                  className="font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                >
                  {thread.listing.name}
                </Link>
              </p>
            )}
          </div>
          {(canModerate || canDelete) && (
            <ThreadActions
              threadId={thread.id}
              isPinned={thread.isPinned}
              isLocked={thread.isLocked}
              canModerate={canModerate}
              canDelete={canDelete}
            />
          )}
        </div>

        <div className="mt-4 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
          {thread.body}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-4 text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {thread.createdBy.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="font-medium text-neutral-600 dark:text-neutral-400">
            {thread.createdBy.name ?? "Unknown"}
          </span>
          <span><TimeAgo date={thread.createdAt} /></span>
        </div>
      </div>

      {/* Comments section */}
      <div className="mt-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">
          {thread.commentCount} {thread.commentCount === 1 ? "Comment" : "Comments"}
        </h2>

        {thread.comments.length > 0 && (
          <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white px-5 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-950">
            {thread.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                threadId={thread.id}
                isLocked={thread.isLocked}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
              />
            ))}
          </div>
        )}

        {/* New comment form */}
        {currentUserId && (
          <div className="mt-4">
            <CommentForm threadId={thread.id} isLocked={thread.isLocked} />
          </div>
        )}

        {!currentUserId && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <Link href="/login" className="font-medium text-neutral-700 hover:underline dark:text-neutral-300">
              Sign in
            </Link>{" "}
            to join the discussion.
          </div>
        )}
      </div>
    </div>
  );
}
