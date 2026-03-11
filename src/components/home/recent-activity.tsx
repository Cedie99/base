import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import type { Listing, Category } from "@/types/listings";
import {
  CATEGORY_SINGULAR,
  CATEGORY_URL_PREFIX,
} from "@/types/listings";
import { getCategoryColors } from "@/lib/utils/category-colors";

export function RecentActivity({ listings }: { listings: Listing[] }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Recently Updated</h2>
        <p className="mt-1 text-sm text-neutral-500">Latest activity across the database</p>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-800">
          <Inbox className="h-10 w-10 text-neutral-300 dark:text-neutral-700" />
          <div>
            <p className="font-medium text-neutral-500 dark:text-neutral-400">No listings yet</p>
            <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-600">
              Be the first to contribute a listing
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {listings.map((listing) => {
            const colors = getCategoryColors(listing.category as Category);
            return (
              <Link
                key={listing.id}
                href={`/${CATEGORY_URL_PREFIX[listing.category]}/${listing.slug}`}
                className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3.5 text-sm transition-all duration-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {CATEGORY_SINGULAR[listing.category]}
                  </span>
                  <span className="font-medium text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-200 dark:group-hover:text-white">
                    {listing.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 dark:text-neutral-600">
                    {new Date(listing.updatedAt).toLocaleDateString()}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-transparent transition-all group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
