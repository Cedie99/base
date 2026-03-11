import type { RevisionDiff } from "@/lib/utils/revision-diff";

export function RevisionDiffView({ diff }: { diff: RevisionDiff }) {
  if (diff.fieldChanges.length === 0 && diff.widgetChanges.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No detectable changes.</p>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {diff.fieldChanges.map((change) => (
        <div key={change.field} className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            {change.label}
          </span>
          {change.type === "added" && (
            <span className="text-green-600 dark:text-green-400">
              + {change.newValue}
            </span>
          )}
          {change.type === "removed" && (
            <span className="text-red-600 line-through dark:text-red-400">
              {change.oldValue}
            </span>
          )}
          {change.type === "changed" && (
            <div className="flex flex-col gap-0.5">
              <span className="text-red-600 line-through dark:text-red-400">
                {change.oldValue}
              </span>
              <span className="text-green-600 dark:text-green-400">
                {change.newValue}
              </span>
            </div>
          )}
        </div>
      ))}
      {diff.widgetChanges.map((change) => (
        <div key={change.widget} className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            {change.label}
          </span>
          {change.type === "added" && (
            <span className="text-green-600 dark:text-green-400">
              + {change.newCount} {change.newCount === 1 ? "item" : "items"}
            </span>
          )}
          {change.type === "removed" && (
            <span className="text-red-600 dark:text-red-400">
              Removed ({change.oldCount}{" "}
              {change.oldCount === 1 ? "item" : "items"})
            </span>
          )}
          {change.type === "changed" && (
            <span className="text-blue-600 dark:text-blue-400">
              {change.oldCount} → {change.newCount}{" "}
              {change.newCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
