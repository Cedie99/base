import type { Revision } from "@/types/listings";

interface RevisionWithUser extends Revision {
  user: { name: string | null; email: string | null } | null;
}

const actionLabels: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
};

export function RevisionList({
  revisions,
}: {
  revisions: RevisionWithUser[];
}) {
  if (revisions.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No revision history available.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {revisions.map((rev) => (
        <div key={rev.id} className="rounded-lg border p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  rev.action === "create"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : rev.action === "delete"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {actionLabels[rev.action] ?? rev.action}
              </span>
              <span className="text-muted-foreground">{rev.entityType}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(rev.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-muted-foreground">
            {rev.user ? (
              <span>by {rev.user.name || rev.user.email}</span>
            ) : rev.userIp ? (
              <span>by anonymous ({rev.userIp})</span>
            ) : (
              <span>by system</span>
            )}
          </div>
          {rev.after != null && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-primary hover:underline">
                View changes
              </summary>
              <pre className="mt-1 max-h-48 overflow-auto rounded bg-muted p-2 text-xs">
                {JSON.stringify(rev.after, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
