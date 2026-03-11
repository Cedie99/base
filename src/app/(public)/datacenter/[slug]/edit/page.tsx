import { getPublicListingBySlug } from "@/lib/listings.queries";
import { SubmissionForm } from "@/components/submission/submission-form";
import { notFound } from "next/navigation";

export default async function EditDatacenterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug("datacenter", slug);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit: {listing.name}</h1>
        <p className="text-muted-foreground">
          Submit changes to this listing for review.
        </p>
      </div>
      <SubmissionForm category="datacenter" listing={listing} />
    </div>
  );
}
