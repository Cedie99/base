import type { ListingSource } from "@/types/listings";

export function SourcesWidget({ sources }: { sources: ListingSource[] }) {
  if (sources.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Sources</h2>
      <ol className="list-decimal list-inside space-y-1.5 text-sm">
        {sources.map((s) => (
          <li key={s.id} className="text-neutral-500">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:underline">
              {s.title || s.url}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
