"use client";

import { Pencil } from "lucide-react";
import { SubmissionFormDialog } from "./submission-form-dialog";
import type { ListingWithWidgets, Category } from "@/types/listings";

interface EditListingButtonProps {
  listing: ListingWithWidgets;
}

export function EditListingButton({ listing }: EditListingButtonProps) {
  return (
    <SubmissionFormDialog
      category={listing.category as Category}
      listing={listing}
      trigger={
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit this page
        </button>
      }
    />
  );
}
