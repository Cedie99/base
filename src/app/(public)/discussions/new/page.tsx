import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth.helpers";
import { NewThreadForm } from "@/components/discussions/new-thread-form";

export const metadata: Metadata = {
  title: "New Discussion — BASE",
};

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ listingId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;

  return (
    <div className="px-4 py-8">
      <NewThreadForm
        listingId={params.listingId}
        backHref={params.listingId ? `/discussions` : "/discussions"}
      />
    </div>
  );
}
