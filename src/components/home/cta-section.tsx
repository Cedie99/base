"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { ref, isVisible } = useReveal();

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center transition-all duration-700 ease-out sm:p-16 dark:border-neutral-800 dark:bg-neutral-900/50",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      {/* Gradient accent line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-neutral-600" />

      {/* Background grid */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-neutral-50 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)] dark:bg-neutral-900/50" />

      <div className="relative z-10 mx-auto max-w-xl space-y-6">
        <span className="inline-block rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          Contribute
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Help Build the Database
        </h2>
        <p className="text-neutral-500">
          BASE is community-driven. Share your knowledge about the web hosting industry —
          add a company, data center, registrar, or industry professional.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/companies/new"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Add a Listing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-white"
          >
            Browse Database
          </Link>
        </div>
      </div>
    </section>
  );
}
