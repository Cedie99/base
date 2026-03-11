import type { ListingNewsItem } from "@/types/listings";

export function NewsWidget({ news }: { news: ListingNewsItem[] }) {
  if (news.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent News</h2>
      <div className="space-y-2">
        {news.map((n) => (
          <div key={n.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            {n.url ? (
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:underline">{n.title}</a>
            ) : (
              <span className="font-medium text-neutral-700 dark:text-neutral-200">{n.title}</span>
            )}
            <div className="flex gap-2 text-xs text-neutral-400 dark:text-neutral-600 mt-1">
              {n.source && <span>{n.source}</span>}
              {n.date && <span>{n.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
