import type { ListingProduct } from "@/types/listings";

export function ProductsWidget({ products }: { products: ListingProduct[] }) {
  if (products.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Products & Services</h2>
      <div className="flex flex-wrap gap-2">
        {products.map((p) => (
          <span key={p.id} className="rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-600 dark:text-neutral-300 transition-colors hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-white">{p.name}</span>
        ))}
      </div>
    </section>
  );
}
