import { Metadata } from "next";
import Link from "next/link";
import { getPublicListingBySlug } from "@/lib/listings.queries";
import { ComparisonTable } from "@/components/compare/comparison-table";
import type { Category, ListingWithWidgets } from "@/types/listings";
import { CATEGORY_LABELS, CATEGORY_PLURAL_URL } from "@/types/listings";
import { GitCompareArrows, ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Listings — MESH",
  description:
    "Compare hosting companies, data centers, and registrars side by side.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string }>;
}) {
  const params = await searchParams;
  const itemsParam = params.items || "";

  const parsed = itemsParam
    .split(",")
    .filter(Boolean)
    .map((s) => {
      const [category, slug] = s.split(":");
      return { category: category as Category, slug };
    })
    .filter((i) => i.category && i.slug)
    .slice(0, 3);

  if (parsed.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 dark:bg-neutral-900 mb-6">
          <GitCompareArrows className="h-10 w-10 text-neutral-300 dark:text-neutral-700" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Compare Listings
        </h1>
        <p className="max-w-lg text-neutral-500 dark:text-neutral-400 mb-8">
          Select 2-3 listings from the same category to compare them side by
          side. Use the compare button on any listing page to get started.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["company", "datacenter", "registrar", "person"] as const).map(
            (cat) => (
              <Link
                key={cat}
                href={`/${CATEGORY_PLURAL_URL[cat]}`}
                className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
              >
                Browse {CATEGORY_LABELS[cat]}
              </Link>
            )
          )}
        </div>
      </div>
    );
  }

  const categories = new Set(parsed.map((i) => i.category));
  if (categories.size > 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 dark:bg-amber-500/10 mb-6">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Cannot Compare
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          You can only compare listings from the same category.
        </p>
      </div>
    );
  }

  const listings = (
    await Promise.all(
      parsed.map((i) => getPublicListingBySlug(i.category, i.slug))
    )
  ).filter(Boolean) as ListingWithWidgets[];

  if (listings.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Listings Not Found
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Some of the selected listings could not be found.
        </p>
      </div>
    );
  }

  const category = listings[0].category;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/${CATEGORY_PLURAL_URL[category]}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-600 dark:hover:text-neutral-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {CATEGORY_LABELS[category]}
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 dark:bg-blue-500/10">
            <GitCompareArrows className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {listings.map((l) => l.name).join(" vs ")}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Comparing {listings.length} {CATEGORY_LABELS[category].toLowerCase()} side by side
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <ComparisonTable listings={listings} />
    </div>
  );
}
