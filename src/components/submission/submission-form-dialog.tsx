"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { SubmissionForm } from "./submission-form";
import type { Category } from "@/types/listings";
import type { ListingWithWidgets } from "@/types/listings";
import { CATEGORY_SINGULAR } from "@/types/listings";

interface SubmissionFormDialogProps {
  category: Category;
  listing?: ListingWithWidgets;
  trigger: React.ReactNode;
}

export function SubmissionFormDialog({
  category,
  listing,
  trigger,
}: SubmissionFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEdit = !!listing;

  const handleSuccess = useCallback(() => {
    setOpen(false);
    router.refresh();
  }, [router]);

  // Lenis smooth scroll on the dialog scroll container
  useEffect(() => {
    if (!open || !scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      prevent: (node: HTMLElement) => node.tagName === "TEXTAREA",
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-background px-6 py-4 rounded-t-xl dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {isEdit ? `Edit ${listing.name}` : `Add ${CATEGORY_SINGULAR[category]}`}
            </h2>
            <p className="text-sm text-neutral-500">
              {isEdit
                ? "Your changes will be submitted for review."
                : "Fill in the details below. Your submission will be reviewed."}
            </p>
          </div>
          <DialogClose />
        </div>
        <div ref={scrollRef} className="max-h-[calc(90vh-5rem)] overflow-y-auto">
          <div className="p-6">
            <SubmissionForm
              category={category}
              listing={listing}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
