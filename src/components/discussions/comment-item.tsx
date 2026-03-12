"use client";

import { useState } from "react";
import { Reply, Trash2 } from "lucide-react";
import { CommentForm } from "./comment-form";
import { TimeAgo } from "@/components/ui/time-ago";
import { deleteComment } from "@/lib/discussions.actions";
import { toast } from "sonner";
import type { CommentWithAuthor } from "@/types/discussions";

interface CommentItemProps {
  comment: CommentWithAuthor;
  threadId: string;
  isLocked: boolean;
  currentUserId?: string;
  currentUserRole?: string;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  threadId,
  isLocked,
  currentUserId,
  currentUserRole,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete =
    currentUserId === comment.createdById ||
    currentUserRole === "admin" ||
    currentUserRole === "moderator";

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setIsDeleting(true);
    const result = await deleteComment(comment.id);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <div className={isReply ? "ml-8 border-l-2 border-neutral-100 pl-4 dark:border-neutral-800" : ""}>
      <div className="group py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {comment.createdBy.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-neutral-900 dark:text-white">
                {comment.createdBy.name ?? "Unknown"}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">
                <TimeAgo date={comment.createdAt} />
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
              {comment.body}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {!isReply && !isLocked && currentUserId && (
                <button
                  type="button"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {showReplyForm && (
          <div className="ml-10 mt-3">
            <CommentForm
              threadId={threadId}
              parentCommentId={comment.id}
              placeholder="Write a reply..."
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              threadId={threadId}
              isLocked={isLocked}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
