import type { ListingExternalLink } from "@/types/listings";
import { ExternalLink } from "lucide-react";

export function ExternalLinksWidget({ links }: { links: ListingExternalLink[] }) {
  if (links.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">External Links</h2>
      <div className="space-y-1">
        {links.map((l) => (
          <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
            <span className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">{l.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
