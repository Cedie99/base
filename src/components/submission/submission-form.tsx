"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils/slug";
import type { Category } from "@/types/listings";
import type { ListingWithWidgets } from "@/types/listings";
import { CATEGORY_SINGULAR, CATEGORY_URL_PREFIX } from "@/types/listings";
import { submitListing, submitListingEdit } from "@/lib/submission.actions";
import type { ActionState } from "@/lib/listings.actions";
import { DuplicateCheck } from "./duplicate-check";
import { OfficesEditor, type OfficeEntry } from "./offices-editor";
import { ProductsEditor } from "./products-editor";

const companyStatuses = [
  { value: "", label: "Select status..." },
  { value: "privately_held", label: "Privately Held" },
  { value: "publicly_held", label: "Publicly Held" },
  { value: "acquired", label: "Acquired" },
  { value: "out_of_business", label: "Out of Business" },
];

const initialState: ActionState = {};

export function SubmissionForm({
  category,
  listing,
}: {
  category: Category;
  listing?: ListingWithWidgets;
}) {
  const router = useRouter();
  const isEdit = !!listing;
  const action = isEdit ? submitListingEdit : submitListing;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(listing?.name ?? "");
  const [slug, setSlug] = useState(listing?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  // Widget state
  const [offices, setOffices] = useState<OfficeEntry[]>(() => {
    if (!listing?.offices) return [];
    return listing.offices.map((o) => ({
      address: o.address,
      city: o.city ?? "",
      state: o.state ?? "",
      country: o.country ?? "",
      postalCode: o.postalCode ?? "",
      isHq: o.isHq,
    }));
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    if (!listing?.products) return [];
    return listing.products.map((p) => p.name);
  });

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
      toast.success("Listing submitted for review!");
      router.push(`/${CATEGORY_URL_PREFIX[category]}/${slug}`);
    }
    if (state.success && isEdit) {
      toast.success("Edit submitted for review!");
      router.push(
        `/${CATEGORY_URL_PREFIX[category]}/${listing?.slug}`
      );
    }
  }, [state, isEdit, router, category, slug, listing?.slug]);

  const isPerson = category === "person";

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="category" value={category} />
      {isEdit && <input type="hidden" name="id" value={listing.id} />}

      {/* Widget JSON hidden inputs */}
      {!isPerson && (
        <>
          <input
            type="hidden"
            name="__offices"
            value={JSON.stringify(offices.filter((o) => o.address.trim()))}
          />
          <input
            type="hidden"
            name="__products"
            value={JSON.stringify(selectedProducts.map((name) => ({ name })))}
          />
        </>
      )}

      {/* Basic Info */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {isEdit ? `Edit ${listing.name}` : `Add ${CATEGORY_SINGULAR[category]}`}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {!isEdit && name.length >= 2 && (
              <DuplicateCheck name={name} category={category} />
            )}
          </div>
          <input type="hidden" name="slug" value={slug} />
        </div>
      </div>

      {/* General Info for non-Person */}
      {!isPerson && (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">General Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input id="legalName" name="legalName" defaultValue={listing?.legalName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input id="url" name="url" type="url" defaultValue={listing?.url ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={listing?.phone ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={listing?.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Employees</Label>
              <Input id="employees" name="employees" type="number" defaultValue={listing?.employees ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servers">Servers</Label>
              <Input id="servers" name="servers" type="number" defaultValue={listing?.servers ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domainsManaged">Domains Under Management</Label>
              <Input id="domainsManaged" name="domainsManaged" type="number" defaultValue={listing?.domainsManaged ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clients">Clients</Label>
              <Input id="clients" name="clients" type="number" defaultValue={listing?.clients ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundingDate">Founding Date</Label>
              <Input id="foundingDate" name="foundingDate" placeholder="e.g. 2002" defaultValue={listing?.foundingDate ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyStatus">Status</Label>
              <select
                id="companyStatus"
                name="companyStatus"
                defaultValue={listing?.companyStatus ?? ""}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
              >
                {companyStatuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" name="logoUrl" type="url" defaultValue={listing?.logoUrl ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <textarea
              id="overview"
              name="overview"
              rows={4}
              defaultValue={listing?.overview ?? ""}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              <Input id="firstName" name="firstName" defaultValue={listing?.firstName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" defaultValue={listing?.lastName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homepageUrl">Homepage URL</Label>
              <Input id="homepageUrl" name="homepageUrl" type="url" defaultValue={listing?.homepageUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" name="linkedinUrl" type="url" defaultValue={listing?.linkedinUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUsername">Twitter</Label>
              <Input id="twitterUsername" name="twitterUsername" defaultValue={listing?.twitterUsername ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blogUrl">Blog URL</Label>
              <Input id="blogUrl" name="blogUrl" type="url" defaultValue={listing?.blogUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input id="facebookUrl" name="facebookUrl" type="url" defaultValue={listing?.facebookUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={listing?.instagramUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok URL</Label>
              <Input id="tiktokUrl" name="tiktokUrl" type="url" defaultValue={listing?.tiktokUrl ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthplace">Birthplace</Label>
              <Input id="birthplace" name="birthplace" defaultValue={listing?.birthplace ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input id="birthdate" name="birthdate" type="date" defaultValue={listing?.birthdate ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input id="photoUrl" name="photoUrl" type="url" defaultValue={listing?.photoUrl ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <textarea
              id="overview"
              name="overview"
              rows={4}
              defaultValue={listing?.overview ?? ""}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Widget Editors — only for non-person categories */}
      {!isPerson && (
        <>
          <OfficesEditor offices={offices} onChange={setOffices} />
          <ProductsEditor
            category={category as Exclude<Category, "person">}
            selected={selectedProducts}
            onChange={setSelectedProducts}
          />
        </>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting..." : isEdit ? "Submit Edit" : "Submit"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
