import type { PersonDegree } from "@/types/listings";
import { GraduationCap } from "lucide-react";

export function DegreesWidget({ degrees }: { degrees: PersonDegree[] }) {
  if (degrees.length === 0) return null;
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Education</h2>
      <div className="space-y-2">
        {degrees.map((d) => (
          <div key={d.id} className="flex gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
            <GraduationCap className="h-4 w-4 mt-0.5 text-neutral-400 dark:text-neutral-600 shrink-0" />
            <div>
              <div className="font-medium text-neutral-700 dark:text-neutral-200">{d.institution}</div>
              <div className="text-neutral-500">{[d.degreeType, d.subject].filter(Boolean).join(" in ")}</div>
              {d.graduationYear && <div className="text-xs text-neutral-400 dark:text-neutral-600">{d.graduationYear}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
