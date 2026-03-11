"use client";

import { useState } from "react";
import { ModerationQueue } from "./moderation-queue";
import { PendingEditsQueue } from "./pending-edits-queue";
import type { Listing } from "@/types/listings";
import type { RevisionWithRelations } from "@/types/listings";

export function ModerationTabs({
  pendingListings,
  pendingRevisions,
}: {
  pendingListings: Listing[];
  pendingRevisions: RevisionWithRelations[];
}) {
  const [activeTab, setActiveTab] = useState<"submissions" | "edits">(
    "submissions"
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg border p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "submissions"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          New Submissions
          {pendingListings.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
              {pendingListings.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("edits")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "edits"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending Edits
          {pendingRevisions.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
              {pendingRevisions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "submissions" && (
        <ModerationQueue listings={pendingListings} />
      )}
      {activeTab === "edits" && (
        <PendingEditsQueue revisions={pendingRevisions} />
      )}
    </div>
  );
}
