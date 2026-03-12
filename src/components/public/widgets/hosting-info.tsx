import type { Listing } from "@/types/listings";

export function HostingInfoWidget({ listing }: { listing: Listing }) {
  const fields = [
    { label: "ASN", value: listing.asnNumber },
    { label: "Uptime Guarantee", value: listing.uptimeGuarantee },
    {
      label: "Green Energy",
      value: listing.greenEnergyCertified
        ? listing.greenEnergyDetails || "Certified"
        : null,
    },
  ].filter((f) => f.value);

  if (fields.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Hosting Information</h2>
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="flex justify-between border-b border-neutral-200 dark:border-neutral-800 py-2 text-sm">
            <dt className="text-neutral-500">{f.label}</dt>
            <dd className="font-medium text-neutral-700 dark:text-neutral-200">
              {f.label === "Green Energy" && (
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
              )}
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
