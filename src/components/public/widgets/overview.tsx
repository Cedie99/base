export function OverviewWidget({ overview }: { overview: string | null }) {
  if (!overview) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Overview</h2>
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
        {overview}
      </p>
    </section>
  );
}
