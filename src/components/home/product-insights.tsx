import Link from "next/link";
import { COMPANY_PRODUCTS } from "@/types/listings";

const topProducts = COMPANY_PRODUCTS.slice(0, 12);

export function ProductInsights() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Browse by Product Type</h2>
        <p className="mt-1 text-sm text-neutral-500">Explore hosting services by category</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {topProducts.map((product) => (
          <Link
            key={product}
            href={`/search?q=${encodeURIComponent(product)}`}
            className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-500 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            {product}
          </Link>
        ))}
      </div>
    </section>
  );
}
