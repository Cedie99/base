import { getListingById } from "@/lib/listings.queries";
import { ListingForm } from "@/components/dashboard/listings/listing-form";
import { notFound } from "next/navigation";
import { WidgetManager } from "@/components/dashboard/listings/widget-manager";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit: {listing.name}
        </h1>
        <p className="text-muted-foreground">
          Update listing details and widgets.
        </p>
      </div>
      <ListingForm listing={listing} />
      <WidgetManager listing={listing} />
    </div>
  );
}
