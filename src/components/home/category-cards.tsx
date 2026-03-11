"use client";

import Link from "next/link";
import type { Category } from "@/types/listings";
import { CATEGORY_LABELS, CATEGORY_PLURAL_URL } from "@/types/listings";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const categories: Category[] = ["company", "datacenter", "registrar", "person"];

export function CategoryCards({ counts }: { counts: Record<string, number> }) {
  const { ref, isVisible } = useReveal();

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat, i) => {
        const Icon = categoryIcons[cat];
        const colors = getCategoryColors(cat);
        return (
          <Link
            key={cat}
            href={`/${CATEGORY_PLURAL_URL[cat]}`}
            className={cn(
              "group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 text-center transition-all hover:scale-[1.02] hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700 dark:hover:shadow-[0_0_40px_8px_rgba(255,255,255,0.05)]",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            style={{
              transitionDuration: "600ms",
              transitionDelay: isVisible ? `${i * 100}ms` : "0ms",
            }}
          >
            {/* Grid background pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 hidden dark:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Radial fade mask */}
            <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} transition-colors`}
              >
                <Icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <div>
                <h2 className="bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text font-semibold text-transparent dark:from-white dark:via-white dark:to-neutral-400">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {counts[cat]?.toLocaleString() ?? 0} listings
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
