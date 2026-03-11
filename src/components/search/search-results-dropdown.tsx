"use client";

import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_URL_PREFIX } from "@/types/listings";
import type { Category } from "@/types/listings";
import type { GroupedSearchResults, SearchResult } from "@/lib/search.queries";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";

const categories: Category[] = ["company", "datacenter", "registrar", "person"];

export function SearchResultsDropdown({
  results,
  query,
  loading,
  onSelect,
}: {
  results: GroupedSearchResults;
  query: string;
  loading: boolean;
  onSelect: () => void;
}) {
  if (loading) {
    return (
      <div className="animate-fade-in absolute top-full left-0 right-0 z-50 mt-2 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Searching...
      </div>
    );
  }

  if (results.total === 0) {
    return (
      <div className="animate-fade-in absolute top-full left-0 right-0 z-50 mt-2 flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <Search className="h-8 w-8 text-neutral-300 dark:text-neutral-700" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No results found for &quot;{query}&quot;
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          Try different keywords or check the spelling
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
      {categories.map((cat) => {
        const items = results[cat];
        if (items.length === 0) return null;
        const colors = getCategoryColors(cat);
        const Icon = categoryIcons[cat];
        return (
          <div key={cat}>
            <div className="sticky top-0 flex items-center gap-2 border-b border-neutral-100 bg-white/95 px-3 py-2 text-xs font-medium text-neutral-500 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
              <Icon className={`h-3.5 w-3.5 ${colors.text}`} />
              {CATEGORY_LABELS[cat]} ({items.length})
            </div>
            {items.map((item) => (
              <SearchResultItem
                key={item.id}
                item={item}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      })}
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="block border-t border-neutral-100 px-3 py-2.5 text-center text-sm text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
      >
        View all {results.total} results
      </Link>
    </div>
  );
}

function SearchResultItem({
  item,
  onSelect,
}: {
  item: SearchResult;
  onSelect: () => void;
}) {
  const href = `/${CATEGORY_URL_PREFIX[item.category]}/${item.slug}`;
  const colors = getCategoryColors(item.category);

  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-neutral-700 truncate dark:text-neutral-200">{item.name}</div>
        {item.url && (
          <div className="text-xs text-neutral-400 truncate dark:text-neutral-600">
            {item.url.replace(/^https?:\/\//, "")}
          </div>
        )}
      </div>
    </Link>
  );
}
