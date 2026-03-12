"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CATEGORY_OPTIONS = [
  { id: "company", label: "Companies", color: "#3b82f6" },
  { id: "datacenter", label: "Data Centers", color: "#10b981" },
  { id: "registrar", label: "Registrars", color: "#f59e0b" },
  { id: "person", label: "People", color: "#8b5cf6" },
];

interface GraphControlsProps {
  activeCategories: string[];
  onToggleCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function GraphControls({
  activeCategories,
  onToggleCategory,
  searchQuery,
  onSearchChange,
}: GraphControlsProps) {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95 max-w-[240px]">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search nodes..."
          className="h-8 pl-8 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_OPTIONS.map((cat) => {
          const active = activeCategories.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                active
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: active ? cat.color : "#d4d4d4" }}
              />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
