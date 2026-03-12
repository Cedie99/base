import type { ListingIpRange } from "@/types/listings";

export function IpRangesWidget({ ipRanges }: { ipRanges: ListingIpRange[] }) {
  if (ipRanges.length === 0) return null;

  const ipv4 = ipRanges.filter((r) => r.type === "ipv4");
  const ipv6 = ipRanges.filter((r) => r.type === "ipv6");

  function RangeGroup({ label, ranges }: { label: string; ranges: ListingIpRange[] }) {
    if (ranges.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-500">{label}</h3>
        <div className="space-y-1.5">
          {ranges.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm">
              <code className="font-mono text-neutral-700 dark:text-neutral-200">{r.cidr}</code>
              {r.description && (
                <span className="text-neutral-500 text-xs">{r.description}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">IP Ranges</h2>
      <RangeGroup label="IPv4" ranges={ipv4} />
      <RangeGroup label="IPv6" ranges={ipv6} />
    </section>
  );
}
