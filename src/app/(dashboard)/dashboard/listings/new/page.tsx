import { ListingForm } from "@/components/dashboard/listings/listing-form";

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Listing</h1>
        <p className="text-muted-foreground">
          Add a new company, data center, registrar, or person.
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
