"use client";

import { useState } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveRevision, rejectRevision } from "@/lib/moderation.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { RevisionWithRelations } from "@/types/listings";
import { CATEGORY_SINGULAR, CATEGORY_URL_PREFIX } from "@/types/listings";
import { computeRevisionDiff } from "@/lib/utils/revision-diff";
import { RevisionDiffView } from "@/components/public/revisions/revision-diff-view";

function getChangedFields(after: Record<string, unknown>): string[] {
  const fields: string[] = [];
  for (const [key, value] of Object.entries(after)) {
    if (key === "widgets") {
      const w = value as Record<string, unknown[]> | undefined;
      if (w?.offices?.length) fields.push("offices");
      if (w?.products?.length) fields.push("products");
    } else if (value !== undefined && value !== null && value !== "") {
      fields.push(key);
    }
  }
  return fields;
}

export function PendingEditsQueue({
  revisions,
}: {
  revisions: RevisionWithRelations[];
}) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleApprove(id: string) {
    const result = await approveRevision(id);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Edit approved and applied");
      router.refresh();
    }
  }

  async function handleReject(id: string) {
    const result = await rejectRevision(id);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Edit rejected");
      router.refresh();
    }
  }

  if (revisions.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No pending edits. All clear!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {revisions.map((revision) => {
        const after = revision.after as Record<string, unknown> | null;
        const before = revision.before as Record<string, unknown> | null;
        const changedFields = after ? getChangedFields(after) : [];
        const isExpanded = expandedId === revision.id;

        return (
          <div
            key={revision.id}
            className="rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-medium">{revision.listing.name}</div>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{CATEGORY_SINGULAR[revision.listing.category]}</span>
                  <span>
                    /{CATEGORY_URL_PREFIX[revision.listing.category]}/
                    {revision.listing.slug}
                  </span>
                  <span>
                    by {revision.user?.name ?? revision.user?.email ?? "Anonymous"}
                  </span>
                  <span>
                    {new Date(revision.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {changedFields.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {changedFields.map((field) => (
                      <span
                        key={field}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : revision.id)
                  }
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="mr-1 h-3.5 w-3.5" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View Details
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApprove(revision.id)}
                >
                  <Check className="mr-1 h-3.5 w-3.5 text-green-600" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(revision.id)}
                >
                  <X className="mr-1 h-3.5 w-3.5 text-red-600" />
                  Reject
                </Button>
              </div>
            </div>
            {isExpanded && (
              <div className="mt-3 rounded bg-muted p-3">
                <RevisionDiffView
                  diff={computeRevisionDiff(before, after)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
