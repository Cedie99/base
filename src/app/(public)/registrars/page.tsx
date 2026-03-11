import Link from "next/link";
import { Globe, Plus, Inbox } from "lucide-react";
import { getPublicListingsByCategory } from "@/lib/listings.queries";
import { CategoryListingCard } from "@/components/public/category-listing-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Registrars — BASE",
  description: "Browse domain name registrars in the BASE database.",
};

export default async function RegistrarsPage() {
  const listings = await getPublicListingsByCategory("registrar");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Globe className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Domain Registrars</h1>
            <p className="text-sm text-neutral-500">
              {listings.length} {listings.length === 1 ? "registrar" : "registrars"}
            </p>
          </div>
        </div>
        <Link
          href="/registrars/new"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          Add Registrar
        </Link>
      </div>
      {listings.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <CategoryListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 py-20">
          <Inbox className="h-12 w-12 text-neutral-300 dark:text-neutral-700" />
          <div className="text-center">
            <p className="font-medium text-neutral-500 dark:text-neutral-400">No registrars yet</p>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-600">
              Be the first to add a domain registrar to the database.
            </p>
          </div>
          <Link
            href="/registrars/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Registrar
          </Link>
        </div>
      )}
    </div>
  );
}
