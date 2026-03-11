import type { ListingMilestone } from "@/types/listings";

export function MilestonesWidget({ milestones }: { milestones: ListingMilestone[] }) {
  if (milestones.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Milestones</h2>
      <div className="space-y-4">
        {milestones.map((m, i) => (
          <div key={m.id} className="relative flex gap-4 pl-6">
            <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-neutral-500 ring-2 ring-neutral-200 dark:ring-neutral-800" />
            {i < milestones.length - 1 && (
              <div className="absolute left-[4.5px] top-4 bottom-0 w-px bg-neutral-100 dark:bg-neutral-800" />
            )}
            {m.date && <span className="shrink-0 text-sm font-medium text-neutral-400 dark:text-neutral-600 w-20">{m.date}</span>}
            <div>
              <div className="font-medium text-sm text-neutral-700 dark:text-neutral-200">{m.title}</div>
              {m.description && <p className="text-sm text-neutral-500">{m.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
