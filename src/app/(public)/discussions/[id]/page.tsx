import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getThreadById } from "@/lib/discussions.queries";
import { getCurrentUser } from "@/lib/auth.helpers";
import { ThreadDetail } from "@/components/discussions/thread-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const thread = await getThreadById(id);
  if (!thread) return { title: "Thread Not Found — BASE" };
  return { title: `${thread.title} — Discussions — BASE` };
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [thread, user] = await Promise.all([
    getThreadById(id),
    getCurrentUser(),
  ]);

  if (!thread) notFound();

  return (
    <div className="px-4 py-8">
      <ThreadDetail
        thread={thread}
        currentUserId={user?.id}
        currentUserRole={user?.role}
      />
    </div>
  );
}
