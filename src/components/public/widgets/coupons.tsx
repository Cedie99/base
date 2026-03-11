import type { ListingCoupon } from "@/types/listings";
import { Ticket } from "lucide-react";

export function CouponsWidget({ coupons }: { coupons: ListingCoupon[] }) {
  if (coupons.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Coupons</h2>
      <div className="space-y-2">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-neutral-500" />
              <code className="rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 font-mono font-bold text-neutral-900 dark:text-white">{c.code}</code>
            </div>
            <p className="mt-1.5 text-neutral-500 dark:text-neutral-400">{c.discount}</p>
            <div className="mt-1.5 flex gap-3 text-xs text-neutral-400 dark:text-neutral-600">
              {c.expiresAt && <span>Expires: {c.expiresAt}</span>}
              <span className="text-emerald-500">{c.votesYes} worked</span>
              <span className="text-red-500">{c.votesNo} didn&apos;t work</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
