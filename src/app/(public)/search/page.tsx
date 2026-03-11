import { searchListings } from "@/lib/search.queries";
import { CategoryListingCard } from "@/components/public/category-listing-card";
import { CATEGORY_LABELS } from "@/types/listings";
import type { Category } from "@/types/listings";
import type { Metadata } from "next";

const categories: Category[] = ["company", "datacenter", "registrar", "person"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} — BASE` : "Search — BASE",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-muted-foreground">
          Enter a search term to find companies, data centers, registrars, and
          people.
        </p>
      </div>
    );
  }

  const results = await searchListings(q, 50);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Search results for &quot;{q}&quot;
        </h1>
        <p className="text-muted-foreground">
          {results.total} {results.total === 1 ? "result" : "results"} found.
        </p>
      </div>

      {categories.map((cat) => {
        const items = results[cat];
        if (items.length === 0) return null;
        return (
          <div key={cat} className="space-y-3">
            <h2 className="text-lg font-semibold">
              {CATEGORY_LABELS[cat]} ({items.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <CategoryListingCard
                  key={item.id}
                  listing={item as Parameters<typeof CategoryListingCard>[0]["listing"]}
                />
              ))}
            </div>
          </div>
        );
      })}

      {results.total === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No results found. Try a different search term.
        </p>
      )}
    </div>
  );
}
