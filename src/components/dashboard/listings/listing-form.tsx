"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createListing, updateListing } from "@/lib/listings.actions";
import type { ActionState } from "@/lib/listings.actions";
import { generateSlug } from "@/lib/utils/slug";
import { toast } from "sonner";
import type { ListingWithWidgets, Category } from "@/types/listings";
import { CATEGORY_SINGULAR } from "@/types/listings";

const categories: Category[] = ["company", "datacenter", "registrar", "person"];
const companyStatuses = [
  { value: "", label: "Select status..." },
  { value: "privately_held", label: "Privately Held" },
  { value: "publicly_held", label: "Publicly Held" },
  { value: "acquired", label: "Acquired" },
  { value: "out_of_business", label: "Out of Business" },
];

const initialState: ActionState = {};

export function ListingForm({ listing }: { listing?: ListingWithWidgets }) {
  const router = useRouter();
  const isEdit = !!listing;
  const action = isEdit ? updateListing : createListing;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [category, setCategory] = useState<Category>(
    listing?.category ?? "company"
  );
  const [name, setName] = useState(listing?.name ?? "");
  const [slug, setSlug] = useState(listing?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  useEffect(() => {
    if (autoSlug && name) {
      setSlug(generateSlug(name));
    }
  }, [name, autoSlug]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success && !isEdit) {
      toast.success("Listing created");
      router.push(`/dashboard/listings/${state.id}/edit`);
    }
    if (state.success && isEdit) {
      toast.success("Listing updated");
      router.refresh();
    }
  }, [state, isEdit, router]);

  const isPerson = category === "person";

  return (
    <form action={formAction} className="space-y-8">
      {isEdit && <input type="hidden" name="id" value={listing.id} />}

      {/* Category + Basic */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isEdit}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_SINGULAR[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setAutoSlug(false);
                }}
                required
              />
              {!autoSlug && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSlug(generateSlug(name));
                    setAutoSlug(true);
                  }}
                >
                  Auto
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              URL: /{category}/{slug}
            </p>
          </div>
        </div>
      </div>

      {/* General Info (Companies/DC/Registrars) */}
      {!isPerson && (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">General Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input
                id="legalName"
                name="legalName"
                defaultValue={listing?.legalName ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                defaultValue={listing?.url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={listing?.phone ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={listing?.email ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Employees</Label>
              <Input
                id="employees"
                name="employees"
                type="number"
                defaultValue={listing?.employees ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servers">Servers</Label>
              <Input
                id="servers"
                name="servers"
                type="number"
                defaultValue={listing?.servers ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domainsManaged">Domains Under Management</Label>
              <Input
                id="domainsManaged"
                name="domainsManaged"
                type="number"
                defaultValue={listing?.domainsManaged ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clients">Clients</Label>
              <Input
                id="clients"
                name="clients"
                type="number"
                defaultValue={listing?.clients ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundingDate">Founding Date</Label>
              <Input
                id="foundingDate"
                name="foundingDate"
                placeholder="e.g. 2002 or 2002-03-15"
                defaultValue={listing?.foundingDate ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyStatus">Status</Label>
              <select
                id="companyStatus"
                name="companyStatus"
                defaultValue={listing?.companyStatus ?? ""}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {companyStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                type="url"
                defaultValue={listing?.logoUrl ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <textarea
              id="overview"
              name="overview"
              rows={4}
              defaultValue={listing?.overview ?? ""}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Person Info */}
      {isPerson && (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Person Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={listing?.firstName ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={listing?.lastName ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homepageUrl">Homepage URL</Label>
              <Input
                id="homepageUrl"
                name="homepageUrl"
                type="url"
                defaultValue={listing?.homepageUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blogUrl">Blog URL</Label>
              <Input
                id="blogUrl"
                name="blogUrl"
                type="url"
                defaultValue={listing?.blogUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUsername">Twitter Username</Label>
              <Input
                id="twitterUsername"
                name="twitterUsername"
                defaultValue={listing?.twitterUsername ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                defaultValue={listing?.linkedinUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                defaultValue={listing?.facebookUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                defaultValue={listing?.instagramUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok URL</Label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                type="url"
                defaultValue={listing?.tiktokUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthplace">Birthplace</Label>
              <Input
                id="birthplace"
                name="birthplace"
                defaultValue={listing?.birthplace ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                defaultValue={listing?.birthdate ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                type="url"
                defaultValue={listing?.photoUrl ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <textarea
              id="overview"
              name="overview"
              rows={4}
              defaultValue={listing?.overview ?? ""}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : isEdit ? "Update Listing" : "Create Listing"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
