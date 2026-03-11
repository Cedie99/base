import type { ListingOffice } from "@/types/listings";
import { MapPin } from "lucide-react";

export function OfficesWidget({ offices }: { offices: ListingOffice[] }) {
  if (offices.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Offices</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {offices.map((o) => (
          <div key={o.id} className="flex gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <MapPin className="h-4 w-4 mt-0.5 text-neutral-400 dark:text-neutral-600 shrink-0" />
            <div>
              <div className="font-medium text-neutral-700 dark:text-neutral-200">{o.label || o.address}{o.isHq && <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">(HQ)</span>}</div>
              <div className="text-neutral-500">{[o.address, o.city, o.state, o.country, o.postalCode].filter(Boolean).join(", ")}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
