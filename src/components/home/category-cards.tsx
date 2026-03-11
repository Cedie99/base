import Link from "next/link";
import type { Category } from "@/types/listings";
import { CATEGORY_LABELS, CATEGORY_PLURAL_URL } from "@/types/listings";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";

const categories: Category[] = ["company", "datacenter", "registrar", "person"];

export function CategoryCards({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat, i) => {
        const Icon = categoryIcons[cat];
        const colors = getCategoryColors(cat);
        return (
          <Link
            key={cat}
            href={`/${CATEGORY_PLURAL_URL[cat]}`}
            className={`animate-fade-in-up group relative flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:shadow-[0_0_40px_8px_rgba(255,255,255,0.05)] stagger-${i + 1}`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} transition-colors`}
            >
              <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">{CATEGORY_LABELS[cat]}</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {counts[cat]?.toLocaleString() ?? 0} listings
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
