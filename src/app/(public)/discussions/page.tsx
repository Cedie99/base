import type { Metadata } from "next";
import { getThreads, getThreadCount } from "@/lib/discussions.queries";
import { ThreadList } from "@/components/discussions/thread-list";

export const metadata: Metadata = {
  title: "Discussions — MESH",
  description: "Community discussions about the web hosting industry",
};

const PER_PAGE = 20;

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const [threads, totalCount] = await Promise.all([
    getThreads(page, PER_PAGE),
    getThreadCount(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Discussions
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Community conversations about the web hosting industry
        </p>
      </div>

      <ThreadList
        threads={threads}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
