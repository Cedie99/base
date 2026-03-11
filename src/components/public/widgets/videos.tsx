import type { ListingVideo } from "@/types/listings";
import { Play } from "lucide-react";

export function VideosWidget({ videos }: { videos: ListingVideo[] }) {
  if (videos.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Videos</h2>
      <div className="space-y-2">
        {videos.map((v) => (
          <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm text-neutral-600 dark:text-neutral-300 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white">
            <Play className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
            <span>{v.title || v.url}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
