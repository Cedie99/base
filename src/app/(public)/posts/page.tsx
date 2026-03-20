import { Inbox } from "lucide-react";
import { getAllApprovedListings, getCategoryCounts } from "@/lib/listings.queries";
import { CategoryListingCard } from "@/components/public/category-listing-card";
import { CategoryFilter } from "@/components/public/category-filter";
import type { Category } from "@/types/listings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Posts — MESH",
  description: "Browse all listings across companies, data centers, registrars, and people in the MESH database.",
};

const validCategories = new Set<string>(["company", "datacenter", "registrar", "person"]);

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category && validCategories.has(category) ? (category as Category) : null;

  const [listings, counts] = await Promise.all([
    getAllApprovedListings(activeCategory ?? undefined),
    getCategoryCounts(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          All Posts
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
          {activeCategory ? " in this category" : " across all categories"}
        </p>
      </div>

      <CategoryFilter counts={counts} activeCategory={activeCategory} />

      {listings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <CategoryListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 py-20">
          <Inbox className="h-12 w-12 text-neutral-300 dark:text-neutral-700" />
          <div className="text-center">
            <p className="font-medium text-neutral-500 dark:text-neutral-400">No listings yet</p>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-600">
              There are no approved listings{activeCategory ? " in this category" : ""} to display.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
