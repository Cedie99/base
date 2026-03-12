"use client";

import { useActionState, useRef } from "react";
import { createComment } from "@/lib/discussions.actions";
import { Send } from "lucide-react";

interface CommentFormProps {
  threadId: string;
  parentCommentId?: string;
  isLocked?: boolean;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({
  threadId,
  parentCommentId,
  isLocked = false,
  onCancel,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(
    async (prev: { error?: string; success?: boolean }, formData: FormData) => {
      const result = await createComment(prev, formData);
      if (result.success) {
        formRef.current?.reset();
        onCancel?.();
      }
      return result;
    },
    {}
  );

  if (isLocked) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        This thread is locked. No new comments can be added.
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="threadId" value={threadId} />
      {parentCommentId && (
        <input type="hidden" name="parentCommentId" value={parentCommentId} />
      )}
      <textarea
        name="body"
        placeholder={placeholder}
        required
        rows={parentCommentId ? 2 : 3}
        className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600"
      />
      {state.error && (
        <p className="text-xs text-red-500">{state.error}</p>
      )}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <Send className="h-3.5 w-3.5" />
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
