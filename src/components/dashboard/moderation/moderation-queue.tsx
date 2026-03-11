"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveListing, rejectListing } from "@/lib/moderation.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Listing } from "@/types/listings";
import { CATEGORY_SINGULAR } from "@/types/listings";

export function ModerationQueue({ listings }: { listings: Listing[] }) {
  const router = useRouter();

  async function handleApprove(id: string) {
    const result = await approveListing(id);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Listing approved");
      router.refresh();
    }
  }

  async function handleReject(id: string) {
    const result = await rejectListing(id);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Listing rejected");
      router.refresh();
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No pending submissions. All clear!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <div className="font-medium">{listing.name}</div>
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>{CATEGORY_SINGULAR[listing.category]}</span>
              <span>/{listing.category}/{listing.slug}</span>
              <span>
                Submitted {new Date(listing.createdAt).toLocaleDateString()}
              </span>
              {listing.createdByIp && (
                <span className="text-xs">IP: {listing.createdByIp}</span>
              )}
            </div>
            {listing.overview && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {listing.overview}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprove(listing.id)}
            >
              <Check className="mr-1 h-3.5 w-3.5 text-green-600" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReject(listing.id)}
            >
              <X className="mr-1 h-3.5 w-3.5 text-red-600" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
