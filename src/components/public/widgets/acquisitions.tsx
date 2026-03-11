import type { ListingAcquisition } from "@/types/listings";

export function AcquisitionsWidget({ acquisitions }: { acquisitions: ListingAcquisition[] }) {
  if (acquisitions.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Acquisitions</h2>
      <div className="space-y-2">
        {acquisitions.map((a) => (
          <div key={a.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <div className="flex justify-between">
              <span className="font-medium text-neutral-700 dark:text-neutral-200">{a.acquiredCompany}</span>
              {a.price && <span className="text-neutral-500">{a.price}</span>}
            </div>
            {a.description && <p className="mt-1 text-neutral-500">{a.description}</p>}
            {a.date && <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">{a.date}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
