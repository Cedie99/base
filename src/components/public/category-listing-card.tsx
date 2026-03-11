import Link from "next/link";
import type { Listing } from "@/types/listings";
import { CATEGORY_URL_PREFIX } from "@/types/listings";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";

const statusLabels: Record<string, string> = {
  privately_held: "Privately Held",
  publicly_held: "Publicly Held",
  acquired: "Acquired",
  out_of_business: "Out of Business",
};

export function CategoryListingCard({ listing }: { listing: Listing }) {
  const href = `/${CATEGORY_URL_PREFIX[listing.category]}/${listing.slug}`;
  const colors = getCategoryColors(listing.category);
  const FallbackIcon = categoryIcons[listing.category];

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:shadow-[0_0_30px_4px_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-start gap-3">
        {listing.logoUrl && listing.category !== "person" ? (
          <img
            src={listing.logoUrl}
            alt=""
            className="h-10 w-10 rounded-lg border border-neutral-200 bg-white object-contain p-1 dark:border-neutral-800 dark:bg-neutral-900"
          />
        ) : listing.photoUrl && listing.category === "person" ? (
          <img
            src={listing.photoUrl}
            alt=""
            className="h-10 w-10 rounded-full border border-neutral-200 object-cover dark:border-neutral-800"
          />
        ) : (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}
          >
            <FallbackIcon className={`h-5 w-5 ${colors.text}`} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-neutral-700 truncate transition-colors group-hover:text-neutral-900 dark:text-neutral-200 dark:group-hover:text-white">
            {listing.name}
          </h3>
          {listing.overview && (
            <p className="mt-0.5 text-sm text-neutral-500 line-clamp-2">
              {listing.overview}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-neutral-400 dark:text-neutral-600">
            {listing.url && (
              <span>{listing.url.replace(/^https?:\/\//, "")}</span>
            )}
            {listing.companyStatus && (
              <span
                className={`rounded-full px-2 py-0.5 ${colors.bg} ${colors.text}`}
              >
                {statusLabels[listing.companyStatus]}
              </span>
            )}
            {listing.foundingDate && (
              <span>Founded {listing.foundingDate}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
