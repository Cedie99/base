import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { ThreadCard } from "./thread-card";
import type { ThreadWithAuthor } from "@/types/discussions";

interface ThreadListProps {
  threads: ThreadWithAuthor[];
  page?: number;
  totalPages?: number;
  newThreadHref?: string;
  showNewThread?: boolean;
  compact?: boolean;
}

export function ThreadList({
  threads,
  page = 1,
  totalPages = 1,
  newThreadHref = "/discussions/new",
  showNewThread = true,
  compact = false,
}: ThreadListProps) {
  return (
    <div className="space-y-4">
      {showNewThread && (
        <div className="flex items-center justify-between">
          <h2 className={compact ? "text-base font-semibold text-neutral-900 dark:text-white" : "text-lg font-semibold text-neutral-900 dark:text-white"}>
            {compact ? "Discussions" : ""}
          </h2>
          <Link
            href={newThreadHref}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:border-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Thread
          </Link>
        </div>
      )}

      {threads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-10 text-center dark:border-neutral-700">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No discussions yet. Be the first to start one!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && (
            <Link
              href={`/discussions?page=${page - 1}`}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/discussions?page=${page + 1}`}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
