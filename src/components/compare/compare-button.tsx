"use client";

import { GitCompareArrows, Check } from "lucide-react";
import { useCompare } from "./compare-provider";

interface CompareButtonProps {
  item: {
    category: string;
    slug: string;
    name: string;
    logoUrl?: string | null;
  };
  variant?: "icon" | "full";
}

export function CompareButton({ item, variant = "full" }: CompareButtonProps) {
  const { addItem, removeItem, isInCompare } = useCompare();
  const inCompare = isInCompare(item.slug);

  function toggle() {
    if (inCompare) {
      removeItem(item.slug);
    } else {
      addItem(item);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
          inCompare
            ? "border-blue-500/50 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400"
            : "border-neutral-200 bg-white/80 text-neutral-400 shadow-sm backdrop-blur-sm hover:border-neutral-300 hover:text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
        }`}
        title={inCompare ? "Remove from compare" : "Add to compare"}
      >
        {inCompare ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <GitCompareArrows className="h-3.5 w-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        inCompare
          ? "border-blue-500/50 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400"
          : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
      }`}
    >
      {inCompare ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <GitCompareArrows className="h-3.5 w-3.5" />
      )}
      {inCompare ? "In Compare" : "Compare"}
    </button>
  );
}
