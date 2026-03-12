import Link from "next/link";
import { MessageSquare, MessageSquarePlus } from "lucide-react";
import type { ThreadWithAuthor } from "@/types/discussions";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

interface ListingDiscussionsProps {
  listingId: string;
  threads: ThreadWithAuthor[];
}

export function ListingDiscussions({
  listingId,
  threads,
}: ListingDiscussionsProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Discussions ({threads.length})
          </h3>
        </div>
        <Link
          href={`/discussions/new?listingId=${listingId}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          Start Discussion
        </Link>
      </div>

      {threads.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No discussions yet. Be the first to start one!
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/discussions/${thread.id}`}
              className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                  {thread.title}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                  {thread.createdBy.name ?? "Unknown"} &middot;{" "}
                  {timeAgo(thread.lastActivityAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                <MessageSquare className="h-3 w-3" />
                {thread.commentCount}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
