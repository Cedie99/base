"use client";

import { Plus } from "lucide-react";
import { SubmissionFormDialog } from "./submission-form-dialog";
import type { Category } from "@/types/listings";

interface AddListingButtonProps {
  category: Category;
  label: string;
  className?: string;
}

export function AddListingButton({
  category,
  label,
  className,
}: AddListingButtonProps) {
  return (
    <SubmissionFormDialog
      category={category}
      trigger={
        <button
          type="button"
          className={
            className ??
            "inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          }
        >
          <Plus className="h-4 w-4" />
          {label}
        </button>
      }
    />
  );
}
