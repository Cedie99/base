"use client";

import { SearchBar } from "@/components/search/search-bar";
import { Database } from "lucide-react";

export function HeroSearch() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />

      {/* Radial fade mask overlay */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Blurred gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-800/40" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-neutral-200/40 blur-3xl dark:bg-neutral-800/30" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center">
        <div className="animate-fade-in-up">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/80">
            <Database className="h-7 w-7 text-neutral-600 dark:text-neutral-300" />
          </div>
        </div>

        <h1 className="animate-fade-in-up stagger-1 text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
          <span className="bg-gradient-to-b from-neutral-900 to-neutral-400 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">
            BASE
          </span>
        </h1>

        <p className="animate-fade-in-up stagger-2 max-w-2xl text-lg leading-relaxed text-neutral-500 sm:text-xl dark:text-neutral-400">
          The community-driven database for the web hosting industry. Discover
          companies, data centers, registrars, and industry professionals.
        </p>

        <div className="animate-fade-in-up stagger-3 relative z-50 w-full max-w-xl">
          <SearchBar className="w-full" size="lg" />
        </div>

        <div className="animate-fade-in-up stagger-4 relative z-0 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            Free &amp; Open
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            Community-Driven
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            No Account Required
          </span>
        </div>
      </div>
    </section>
  );
}
