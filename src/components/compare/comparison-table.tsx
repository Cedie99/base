import type { ListingWithWidgets, Category } from "@/types/listings";
import { CATEGORY_URL_PREFIX, CATEGORY_SINGULAR } from "@/types/listings";
import { getCategoryColors, categoryIcons } from "@/lib/utils/category-colors";
import Link from "next/link";
import { Check, Minus, ExternalLink, MapPin, Leaf } from "lucide-react";

function SectionHeader({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan: number;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="bg-neutral-50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:bg-neutral-900/70 dark:text-neutral-500"
      >
        {children}
      </td>
    </tr>
  );
}

function InfoRow({
  label,
  values,
  mono,
}: {
  label: string;
  values: (string | number | null | undefined)[];
  mono?: boolean;
}) {
  const hasAny = values.some((v) => v != null && v !== "");
  if (!hasAny) return null;
  return (
    <tr className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
      <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-6 text-sm font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 min-w-[160px]">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`px-5 py-3.5 text-sm text-neutral-700 dark:text-neutral-200 min-w-[220px] ${mono ? "font-mono text-xs" : ""}`}
        >
          {v != null && v !== "" ? (
            String(v)
          ) : (
            <Minus className="h-4 w-4 text-neutral-200 dark:text-neutral-800" />
          )}
        </td>
      ))}
    </tr>
  );
}

function CheckRow({
  label,
  values,
}: {
  label: string;
  values: boolean[];
}) {
  return (
    <tr className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
      <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-6 text-sm font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 min-w-[160px]">
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="px-5 py-3.5 text-sm min-w-[220px]">
          {v ? (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
            </span>
          ) : (
            <Minus className="h-4 w-4 text-neutral-200 dark:text-neutral-800" />
          )}
        </td>
      ))}
    </tr>
  );
}

export function ComparisonTable({
  listings,
}: {
  listings: ListingWithWidgets[];
}) {
  const allProductNames = [
    ...new Set(listings.flatMap((l) => l.products.map((p) => p.name))),
  ].sort();
  const category = listings[0]?.category as Category;
  const colors = getCategoryColors(category);
  const CategoryIcon = categoryIcons[category];
  const colSpan = listings.length + 1;

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {/* Empty header cell */}
            <th className="sticky left-0 z-20 bg-neutral-50 p-5 min-w-[160px] dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  <CategoryIcon className="h-3 w-3" />
                  {CATEGORY_SINGULAR[category]}
                </span>
              </div>
            </th>
            {listings.map((l) => (
              <th key={l.id} className="p-5 min-w-[220px] bg-neutral-50 dark:bg-neutral-900">
                <Link
                  href={`/${CATEGORY_URL_PREFIX[category]}/${l.slug}`}
                  className="group flex flex-col items-center gap-3 text-center"
                >
                  {l.logoUrl ? (
                    <img
                      src={l.logoUrl}
                      alt=""
                      className="h-14 w-14 rounded-xl border border-neutral-200 bg-white object-contain p-1.5 transition-shadow group-hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
                    />
                  ) : l.photoUrl ? (
                    <img
                      src={l.photoUrl}
                      alt=""
                      className="h-14 w-14 rounded-full border border-neutral-200 object-cover transition-shadow group-hover:shadow-md dark:border-neutral-700"
                    />
                  ) : (
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg}`}
                    >
                      <CategoryIcon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {l.name}
                    </span>
                    {l.url && (
                      <span className="mt-0.5 flex items-center justify-center gap-1 text-xs text-neutral-400">
                        <ExternalLink className="h-3 w-3" />
                        {l.url.replace(/^https?:\/\/(www\.)?/, "")}
                      </span>
                    )}
                  </div>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Key Stats */}
          <SectionHeader colSpan={colSpan}>Key Stats</SectionHeader>
          <InfoRow
            label="Founded"
            values={listings.map((l) => l.foundingDate)}
          />
          <InfoRow
            label="Employees"
            values={listings.map((l) =>
              l.employees ? l.employees.toLocaleString() : null
            )}
          />
          <InfoRow
            label="Servers"
            values={listings.map((l) =>
              l.servers ? l.servers.toLocaleString() : null
            )}
          />
          <InfoRow
            label="Clients"
            values={listings.map((l) =>
              l.clients ? l.clients.toLocaleString() : null
            )}
          />
          <InfoRow
            label="Domains Managed"
            values={listings.map((l) =>
              l.domainsManaged ? l.domainsManaged.toLocaleString() : null
            )}
          />
          <InfoRow
            label="ASN"
            values={listings.map((l) => l.asnNumber)}
            mono
          />
          <InfoRow
            label="Uptime Guarantee"
            values={listings.map((l) => l.uptimeGuarantee)}
          />

          {/* Green Energy */}
          <SectionHeader colSpan={colSpan}>Sustainability</SectionHeader>
          <tr className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
            <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-6 text-sm font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 min-w-[160px]">
              Green Energy
            </td>
            {listings.map((l) => (
              <td
                key={l.id}
                className="px-5 py-3.5 text-sm min-w-[220px]"
              >
                {l.greenEnergyCertified ? (
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <Leaf className="h-3 w-3" />
                      Certified
                    </span>
                    {l.greenEnergyDetails && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {l.greenEnergyDetails}
                      </p>
                    )}
                  </div>
                ) : (
                  <Minus className="h-4 w-4 text-neutral-200 dark:text-neutral-800" />
                )}
              </td>
            ))}
          </tr>

          {/* Products */}
          {allProductNames.length > 0 && (
            <>
              <SectionHeader colSpan={colSpan}>
                Products & Services
              </SectionHeader>
              {allProductNames.map((product) => (
                <CheckRow
                  key={product}
                  label={product}
                  values={listings.map((l) =>
                    l.products.some((p) => p.name === product)
                  )}
                />
              ))}
            </>
          )}

          {/* Offices */}
          <SectionHeader colSpan={colSpan}>Offices</SectionHeader>
          <tr className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
            <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-6 text-sm font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 min-w-[160px]">
              Locations
            </td>
            {listings.map((l) => (
              <td
                key={l.id}
                className="px-5 py-3.5 text-sm text-neutral-700 dark:text-neutral-200 min-w-[220px] align-top"
              >
                {l.offices.length > 0 ? (
                  <div className="space-y-1.5">
                    {l.offices.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-start gap-1.5 text-xs"
                      >
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-neutral-400" />
                        <span>
                          {[o.city, o.state, o.country]
                            .filter(Boolean)
                            .join(", ") || o.address}
                          {o.isHq && (
                            <span className="ml-1 rounded bg-neutral-100 px-1 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                              HQ
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Minus className="h-4 w-4 text-neutral-200 dark:text-neutral-800" />
                )}
              </td>
            ))}
          </tr>

          {/* Funding */}
          <SectionHeader colSpan={colSpan}>Funding</SectionHeader>
          <tr className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
            <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-6 text-sm font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 min-w-[160px]">
              Rounds
            </td>
            {listings.map((l) => (
              <td
                key={l.id}
                className="px-5 py-3.5 text-sm text-neutral-700 dark:text-neutral-200 min-w-[220px] align-top"
              >
                {l.funding.length > 0 ? (
                  <div className="space-y-2">
                    {l.funding.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-lg border border-neutral-100 bg-neutral-50/50 px-2.5 py-1.5 dark:border-neutral-800 dark:bg-neutral-900/50"
                      >
                        <div className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                          {f.roundName}
                          {f.amount && (
                            <span className="ml-1.5 text-neutral-400">
                              {f.amount}
                            </span>
                          )}
                        </div>
                        {f.date && (
                          <div className="text-[11px] text-neutral-400">
                            {f.date}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Minus className="h-4 w-4 text-neutral-200 dark:text-neutral-800" />
                )}
              </td>
            ))}
          </tr>

          {/* Control Panels */}
          <SectionHeader colSpan={colSpan}>
            Control Panels
          </SectionHeader>
          <tr className="border-b border-neutral-100 dark:border-neutral-800/60 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
            <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-6 text-sm font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 min-w-[160px]">
              Supported
            </td>
            {listings.map((l) => (
              <td
                key={l.id}
                className="px-5 py-3.5 text-sm min-w-[220px]"
              >
                {l.controlPanels && l.controlPanels.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {l.controlPanels.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {c.name}
                        {c.isDefault && (
                          <span className="rounded bg-neutral-200 px-1 text-[9px] font-bold uppercase dark:bg-neutral-700">
                            Default
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Minus className="h-4 w-4 text-neutral-200 dark:text-neutral-800" />
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
