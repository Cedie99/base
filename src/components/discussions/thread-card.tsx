import Link from "next/link";
import { MessageSquare, Pin, Lock } from "lucide-react";
import { TimeAgo } from "@/components/ui/time-ago";
import type { ThreadWithAuthor } from "@/types/discussions";

export function ThreadCard({ thread }: { thread: ThreadWithAuthor }) {
  return (
    <Link
      href={`/discussions/${thread.id}`}
      className="group block rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {thread.isPinned && (
              <Pin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            )}
            {thread.isLocked && (
              <Lock className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
            )}
            <h3 className="truncate text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200">
              {thread.title}
            </h3>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {thread.body}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {thread.createdBy.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span>{thread.createdBy.name ?? "Unknown"}</span>
            </div>
            <span><TimeAgo date={thread.lastActivityAt} /></span>
            {thread.listing && (
              <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {thread.listing.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          <MessageSquare className="h-3.5 w-3.5" />
          {thread.commentCount}
        </div>
      </div>
    </Link>
  );
}
