"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteListing } from "@/lib/listings.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Listing } from "@/types/listings";
import {
  CATEGORY_SINGULAR,
} from "@/types/listings";

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function ListingTable({ listings }: { listings: Listing[] }) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const result = await deleteListing(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Listing deleted");
      router.refresh();
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No listings yet. Create your first one!
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Updated</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/listings/${listing.id}/edit`}
                  className="font-medium hover:underline"
                >
                  {listing.name}
                </Link>
                <div className="text-xs text-muted-foreground">
                  /{listing.category}/{listing.slug}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                {CATEGORY_SINGULAR[listing.category]}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[listing.approvalStatus]}`}
                >
                  {listing.approvalStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {new Date(listing.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    nativeButton={false}
                    render={
                      <Link href={`/dashboard/listings/${listing.id}/edit`} />
                    }
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(listing.id, listing.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
