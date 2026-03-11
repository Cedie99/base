import {
  getPendingSubmissions,
  getPendingRevisions,
} from "@/lib/moderation.queries";
import { ModerationTabs } from "@/components/dashboard/moderation/moderation-tabs";

export default async function ModerationPage() {
  const [pendingListings, pendingRevisions] = await Promise.all([
    getPendingSubmissions(),
    getPendingRevisions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground">
          Review and approve pending submissions and edits.
        </p>
      </div>
      <ModerationTabs
        pendingListings={pendingListings}
        pendingRevisions={pendingRevisions}
      />
    </div>
  );
}
