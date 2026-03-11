"use client";

import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, type Category } from "@/types/listings";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";
import { LayoutGrid } from "lucide-react";

const categories: Category[] = ["company", "datacenter", "registrar", "person"];

interface CategoryFilterProps {
  counts: Record<string, number>;
  activeCategory: string | null;
}

export function CategoryFilter({ counts, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => router.push("/posts")}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
            : "border border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        All
        <span className="ml-0.5 text-xs opacity-70">{total}</span>
      </button>
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const colors = getCategoryColors(cat);
        const Icon = categoryIcons[cat];
        return (
          <button
            key={cat}
            onClick={() => router.push(`/posts?category=${cat}`)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? `${colors.bg} ${colors.text} ${colors.border} border`
                : "border border-neutral-200 text-neutral-500 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {CATEGORY_LABELS[cat]}
            <span className="ml-0.5 text-xs opacity-70">{counts[cat] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
