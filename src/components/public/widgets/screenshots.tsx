import type { ListingScreenshot } from "@/types/listings";

export function ScreenshotsWidget({ screenshots }: { screenshots: ListingScreenshot[] }) {
  if (screenshots.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Screenshots</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {screenshots.map((s) => (
          <figure key={s.id} className="space-y-1.5">
            <img src={s.imageUrl} alt={s.caption || "Screenshot"} className="rounded-xl border border-neutral-200 dark:border-neutral-800 w-full" />
            {s.caption && <figcaption className="text-xs text-neutral-500 text-center">{s.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
