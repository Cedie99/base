import type { ListingExit } from "@/types/listings";

export function ExitsWidget({ exits }: { exits: ListingExit[] }) {
  if (exits.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Exits</h2>
      <div className="space-y-2">
        {exits.map((e) => (
          <div key={e.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <div className="flex justify-between">
              <span className="font-medium text-neutral-700 dark:text-neutral-200">{e.exitType}</span>
              {e.amount && <span className="text-neutral-500">{e.amount}</span>}
            </div>
            {e.acquirer && <div className="text-neutral-500">Acquirer: {e.acquirer}</div>}
            {e.description && <p className="mt-1 text-neutral-500">{e.description}</p>}
            {e.date && <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">{e.date}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
