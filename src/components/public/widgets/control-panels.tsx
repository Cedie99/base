import type { ListingControlPanel } from "@/types/listings";

export function ControlPanelsWidget({ controlPanels }: { controlPanels: ListingControlPanel[] }) {
  if (controlPanels.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Control Panels</h2>
      <div className="flex flex-wrap gap-2">
        {controlPanels.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-600 dark:text-neutral-300 transition-colors hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-white"
          >
            {c.name}
            {c.version && (
              <span className="text-xs text-neutral-400">v{c.version}</span>
            )}
            {c.isDefault && (
              <span className="rounded bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 text-[10px] font-medium uppercase text-neutral-500 dark:text-neutral-400">Default</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
