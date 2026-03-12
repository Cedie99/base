import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryCounts } from "@/lib/listings.queries";
import { getPendingSubmissions } from "@/lib/moderation.queries";
import { getUserSubmissions } from "@/lib/users.queries";
import {
  getUserDiscussionStats,
  getUserRecentThreads,
} from "@/lib/notifications.queries";
import { CATEGORY_LABELS, CATEGORY_SINGULAR } from "@/types/listings";
import type { Category } from "@/types/listings";
import { MessageSquare, MessagesSquare, Reply } from "lucide-react";
import Link from "next/link";

async function DiscussionStatsCard({ userId }: { userId: string }) {
  const [stats, recentThreads] = await Promise.all([
    getUserDiscussionStats(userId),
    getUserRecentThreads(userId),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Discussions</CardTitle>
        <CardDescription>Your discussion activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{stats.threadsCreated}</span>
            <span className="text-xs text-muted-foreground">Threads</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{stats.commentsPosted}</span>
            <span className="text-xs text-muted-foreground">Comments</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
            <Reply className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">
              {stats.totalRepliesReceived}
            </span>
            <span className="text-xs text-muted-foreground">Replies</span>
          </div>
        </div>

        {recentThreads.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Recent Threads</p>
            <ul className="space-y-2">
              {recentThreads.map((thread) => (
                <li key={thread.id}>
                  <Link
                    href={`/discussions/${thread.id}`}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <span className="truncate">{thread.title}</span>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                      {thread.commentCount}{" "}
                      {thread.commentCount === 1 ? "comment" : "comments"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const isStaff = role === "admin" || role === "moderator";

  if (isStaff) {
    const [categoryCounts, pending] = await Promise.all([
      getCategoryCounts(),
      getPendingSubmissions(),
    ]);

    const totalListings = Object.values(categoryCounts).reduce(
      (a, b) => a + b,
      0
    );

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
            <Card key={cat}>
              <CardHeader className="pb-2">
                <CardDescription>{CATEGORY_LABELS[cat]}</CardDescription>
                <CardTitle className="text-2xl">
                  {categoryCounts[cat] ?? 0}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                {totalListings} approved listings across all categories
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Review</CardTitle>
              <CardDescription>
                {pending.length} submission{pending.length !== 1 ? "s" : ""}{" "}
                awaiting review
              </CardDescription>
            </CardHeader>
            {pending.length > 0 && (
              <CardContent>
                <ul className="space-y-2">
                  {pending.slice(0, 5).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <Badge variant="secondary">
                        {CATEGORY_SINGULAR[item.category]}
                      </Badge>
                    </li>
                  ))}
                  {pending.length > 5 && (
                    <li className="text-xs text-muted-foreground">
                      +{pending.length - 5} more
                    </li>
                  )}
                </ul>
              </CardContent>
            )}
          </Card>
        </div>

        <DiscussionStatsCard userId={session.user.id} />
      </div>
    );
  }

  // Regular user view
  const submissions = await getUserSubmissions(session.user.id);

  const statusColors: Record<string, "default" | "secondary" | "destructive"> =
    {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {session.user.name ?? "User"}!</CardTitle>
          <CardDescription>
            Here&apos;s an overview of your contributions.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Submissions</CardTitle>
          <CardDescription>
            {submissions.length === 0
              ? "You haven't submitted any listings yet."
              : `${submissions.length} submission${submissions.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        {submissions.length > 0 && (
          <CardContent>
            <ul className="space-y-2">
              {submissions.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-2 text-muted-foreground">
                      {CATEGORY_SINGULAR[item.category]}
                    </span>
                  </div>
                  <Badge variant={statusColors[item.approvalStatus]}>
                    {item.approvalStatus}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

      <DiscussionStatsCard userId={session.user.id} />
    </div>
  );
}
