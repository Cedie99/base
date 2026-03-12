"use client";

import { useRouter } from "next/navigation";
import { Pin, Lock, Trash2 } from "lucide-react";
import {
  togglePinThread,
  toggleLockThread,
  deleteThread,
} from "@/lib/discussions.actions";
import { toast } from "sonner";

interface ThreadActionsProps {
  threadId: string;
  isPinned: boolean;
  isLocked: boolean;
  canModerate: boolean;
  canDelete: boolean;
}

export function ThreadActions({
  threadId,
  isPinned,
  isLocked,
  canModerate,
  canDelete,
}: ThreadActionsProps) {
  const router = useRouter();

  const handlePin = async () => {
    const result = await togglePinThread(threadId);
    if (result.error) toast.error(result.error);
  };

  const handleLock = async () => {
    const result = await toggleLockThread(threadId);
    if (result.error) toast.error(result.error);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this thread and all its comments?")) return;
    const result = await deleteThread(threadId);
    if (result.error) {
      toast.error(result.error);
    } else {
      router.push("/discussions");
    }
  };

  return (
    <div className="flex items-center gap-1">
      {canModerate && (
        <>
          <button
            type="button"
            onClick={handlePin}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
              isPinned
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            <Pin className="h-3.5 w-3.5" />
            {isPinned ? "Unpin" : "Pin"}
          </button>
          <button
            type="button"
            onClick={handleLock}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
              isLocked
                ? "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            {isLocked ? "Unlock" : "Lock"}
          </button>
        </>
      )}
      {canDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      )}
    </div>
  );
}
