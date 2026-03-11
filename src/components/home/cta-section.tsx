import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
      {/* Background grid */}
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-neutral-50 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)] dark:bg-neutral-900/50" />

      <div className="relative z-10 mx-auto max-w-xl space-y-6">
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
