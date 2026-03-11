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
import { CATEGORY_LABELS, CATEGORY_SINGULAR } from "@/types/listings";
import type { Category } from "@/types/listings";

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
      </div>
    );
  }

  // Regular user view
  const submissions = await getUserSubmissions(session.user.id);

  const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
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
    </div>
  );
}
