import type { ListingPartner } from "@/types/listings";

export function PartnersWidget({ partners }: { partners: ListingPartner[] }) {
  if (partners.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Partners</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {partners.map((p) => (
          <div key={p.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <div className="font-medium text-neutral-700 dark:text-neutral-200">{p.partnerName}</div>
            {p.description && <p className="text-neutral-500">{p.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
