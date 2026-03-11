import type { ListingFunding } from "@/types/listings";

export function FundingWidget({ funding }: { funding: ListingFunding[] }) {
  if (funding.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Funding</h2>
      <div className="space-y-2">
        {funding.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <div>
              <div className="font-medium text-neutral-700 dark:text-neutral-200">{f.roundName || "Funding Round"}</div>
              {f.investors && <div className="text-xs text-neutral-500">{f.investors}</div>}
            </div>
            <div className="text-right">
              {f.amount && <div className="font-medium text-neutral-700 dark:text-neutral-200">{f.amount}</div>}
              {f.date && <div className="text-xs text-neutral-500">{f.date}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
