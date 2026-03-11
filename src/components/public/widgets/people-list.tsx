import type { ListingPerson } from "@/types/listings";

export function PeopleWidget({ people }: { people: ListingPerson[] }) {
  if (people.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">People</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {people.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {p.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-neutral-700 dark:text-neutral-200">{p.name}</div>
              {p.title && <div className="text-xs text-neutral-500">{p.title}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
