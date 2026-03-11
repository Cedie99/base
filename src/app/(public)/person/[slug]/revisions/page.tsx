import { getPublicListingBySlug } from "@/lib/listings.queries";
import { getRevisionsByListingId } from "@/lib/revisions.queries";
import { RevisionList } from "@/components/public/revisions/revision-list";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PersonRevisionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug("person", slug);
  if (!listing) notFound();

  const revisions = await getRevisionsByListingId(listing.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/person/${slug}`}
          className="text-sm text-primary hover:underline"
        >
          &larr; Back to {listing.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          Revision History: {listing.name}
        </h1>
      </div>
      <RevisionList revisions={revisions as Parameters<typeof RevisionList>[0]["revisions"]} />
    </div>
  );
}
