"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/listings";
import { getCategoryColors } from "@/lib/utils/category-colors";
import { SubmissionFormDialog } from "@/components/submission/submission-form-dialog";

const quickAddItems: { label: string; category: Category }[] = [
  { label: "Add Company", category: "company" },
  { label: "Add Data Center", category: "datacenter" },
  { label: "Add Registrar", category: "registrar" },
  { label: "Add Person", category: "person" },
];

export function QuickAdd() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Contribute</h2>
        <p className="mt-1 text-sm text-neutral-500">Help grow the database</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {quickAddItems.map((item) => {
          const colors = getCategoryColors(item.category);
          return (
            <SubmissionFormDialog
              key={item.category}
              category={item.category}
              trigger={
                <Button
                  variant="outline"
                  className="border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <Plus className={`mr-1.5 h-4 w-4 ${colors.text}`} />
                  {item.label}
                </Button>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
