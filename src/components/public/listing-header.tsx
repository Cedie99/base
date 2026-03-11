import Link from "next/link";
import { Pencil, History } from "lucide-react";
import type { ListingWithWidgets } from "@/types/listings";
import { CATEGORY_SINGULAR, CATEGORY_URL_PREFIX } from "@/types/listings";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";

const statusLabels: Record<string, string> = {
  privately_held: "Privately Held",
  publicly_held: "Publicly Held",
  acquired: "Acquired",
  out_of_business: "Out of Business",
};

export function ListingHeader({ listing }: { listing: ListingWithWidgets }) {
  const isPerson = listing.category === "person";
  const colors = getCategoryColors(listing.category);
  const CategoryIcon = categoryIcons[listing.category];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6">
        {listing.logoUrl && !isPerson ? (
          <img
            src={listing.logoUrl}
            alt={`${listing.name} logo`}
            className="h-20 w-20 rounded-2xl border border-neutral-200 bg-white object-contain p-2 dark:border-neutral-800 dark:bg-neutral-900"
          />
        ) : listing.photoUrl && isPerson ? (
          <img
            src={listing.photoUrl}
            alt={listing.name}
            className="h-20 w-20 rounded-full border border-neutral-200 object-cover dark:border-neutral-800"
          />
        ) : (
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl ${colors.bg}`}
          >
            <CategoryIcon className={`h-10 w-10 ${colors.text}`} />
          </div>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              <CategoryIcon className="h-3 w-3" />
              {CATEGORY_SINGULAR[listing.category]}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{listing.name}</h1>
          {listing.legalName && listing.legalName !== listing.name && (
            <p className="text-neutral-500 dark:text-neutral-400">{listing.legalName}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            {listing.url && (
              <a
                href={listing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-white"
              >
                {listing.url.replace(/^https?:\/\//, "")}
              </a>
            )}
            {listing.companyStatus && (
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                {statusLabels[listing.companyStatus]}
              </span>
            )}
            {listing.foundingDate && (
              <span>Founded {listing.foundingDate}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <Link
          href={`/${CATEGORY_URL_PREFIX[listing.category]}/${listing.slug}/edit`}
          className="inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit this page
        </Link>
        <Link
          href={`/${CATEGORY_URL_PREFIX[listing.category]}/${listing.slug}/revisions`}
          className="inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-600 dark:hover:text-neutral-300"
        >
          <History className="h-3.5 w-3.5" />
          Revision History
        </Link>
      </div>
    </div>
  );
}
