import { getAllListings } from "@/lib/listings.queries";
import { ListingTable } from "@/components/dashboard/listings/listing-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ListingsPage() {
  const listings = await getAllListings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">
            Manage all listings across categories.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard/listings/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Listing
        </Button>
      </div>
      <ListingTable listings={listings} />
    </div>
  );
}
