"use client";

import Link from "next/link";
import { X, GitCompareArrows, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./compare-provider";

export function CompareBar() {
  const { items, removeItem, clearItems, compareUrl } = useCompare();

  if (items.length === 0) return null;

  const emptySlots = 3 - items.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/80 bg-white/80 backdrop-blur-2xl dark:border-neutral-800/60 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Items */}
        <div className="flex flex-1 items-center gap-3 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.slug}
              className="group relative flex shrink-0 items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-900"
            >
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt=""
                  className="h-7 w-7 rounded-lg border border-neutral-100 bg-white object-contain p-0.5 dark:border-neutral-800 dark:bg-neutral-900"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold text-neutral-400 dark:bg-neutral-800">
                  {item.name.charAt(0)}
                </div>
              )}
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                {item.name}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="ml-0.5 rounded-md p-0.5 text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slot placeholders */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex h-[42px] shrink-0 items-center gap-2 rounded-xl border border-dashed border-neutral-200 px-3.5 text-sm text-neutral-300 dark:border-neutral-800 dark:text-neutral-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add listing</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 border-l border-neutral-200 pl-4 dark:border-neutral-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearItems}
            className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500"
          >
            Clear
          </Button>
          {items.length >= 2 ? (
            <Link
              href={compareUrl}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare Now
            </Link>
          ) : (
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              Add {2 - items.length} more to compare
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
