"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ListingWithWidgets, Category } from "@/types/listings";
import { PRODUCTS_BY_CATEGORY } from "@/types/listings";
import {
  addOffice, removeOffice,
  addPerson, removePerson,
  addProduct, removeProduct,
  addMilestone, removeMilestone,
  addVideo, removeVideo,
  addTag, removeTag,
  addFunding, removeFunding,
  addAcquisition, removeAcquisition,
  addExit, removeExit,
  addPartner, removePartner,
  addScreenshot, removeScreenshot,
  addDatacenterLink, removeDatacenterLink,
  addNews, removeNews,
  addExternalLink, removeExternalLink,
  addSource, removeSource,
  addCoupon, removeCoupon,
  addDegree, removeDegree,
} from "@/lib/widgets.actions";

type Tab =
  | "offices"
  | "people"
  | "products"
  | "milestones"
  | "videos"
  | "tags"
  | "funding"
  | "acquisitions"
  | "exits"
  | "partners"
  | "screenshots"
  | "datacenters"
  | "news"
  | "links"
  | "sources"
  | "coupons"
  | "degrees";

function getTabsForCategory(category: string): { key: Tab; label: string }[] {
  const commonTabs: { key: Tab; label: string }[] = [
    { key: "offices", label: "Offices" },
    { key: "people", label: "People" },
    { key: "products", label: "Products" },
    { key: "milestones", label: "Milestones" },
    { key: "videos", label: "Videos" },
    { key: "tags", label: "Tags" },
    { key: "funding", label: "Funding" },
    { key: "acquisitions", label: "Acquisitions" },
    { key: "exits", label: "Exits" },
    { key: "partners", label: "Partners" },
    { key: "screenshots", label: "Screenshots" },
    { key: "news", label: "News" },
    { key: "links", label: "External Links" },
    { key: "sources", label: "Sources" },
  ];

  if (category === "company") {
    return [
      ...commonTabs,
      { key: "datacenters", label: "Data Centers" },
      { key: "coupons", label: "Coupons" },
    ];
  }
  if (category === "registrar") {
    return [...commonTabs, { key: "coupons", label: "Coupons" }];
  }
  if (category === "person") {
    return [
      { key: "degrees", label: "Degrees" },
      { key: "milestones", label: "Milestones" },
      { key: "tags", label: "Tags" },
      { key: "links", label: "Links" },
    ];
  }
  // datacenter
  return commonTabs;
}

export function WidgetManager({ listing }: { listing: ListingWithWidgets }) {
  const tabs = getTabsForCategory(listing.category);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0].key);
  const router = useRouter();

  async function handleRemove(
    removeFn: (id: string) => Promise<{ error?: string; success?: boolean }>,
    id: string
  ) {
    const result = await removeFn(id);
    if (result.error) toast.error(result.error);
    else router.refresh();
  }

  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap gap-1 border-b p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === "offices" && (
          <OfficesWidget listing={listing} onRemove={(id) => handleRemove(removeOffice, id)} />
        )}
        {activeTab === "people" && (
          <PeopleWidget listing={listing} onRemove={(id) => handleRemove(removePerson, id)} />
        )}
        {activeTab === "products" && (
          <ProductsWidget listing={listing} onRemove={(id) => handleRemove(removeProduct, id)} />
        )}
        {activeTab === "milestones" && (
          <MilestonesWidget listing={listing} onRemove={(id) => handleRemove(removeMilestone, id)} />
        )}
        {activeTab === "videos" && (
          <VideosWidget listing={listing} onRemove={(id) => handleRemove(removeVideo, id)} />
        )}
        {activeTab === "tags" && (
          <TagsWidget listing={listing} onRemove={(id) => handleRemove(removeTag, id)} />
        )}
        {activeTab === "funding" && (
          <FundingWidget listing={listing} onRemove={(id) => handleRemove(removeFunding, id)} />
        )}
        {activeTab === "acquisitions" && (
          <AcquisitionsWidget listing={listing} onRemove={(id) => handleRemove(removeAcquisition, id)} />
        )}
        {activeTab === "exits" && (
          <ExitsWidget listing={listing} onRemove={(id) => handleRemove(removeExit, id)} />
        )}
        {activeTab === "partners" && (
          <PartnersWidget listing={listing} onRemove={(id) => handleRemove(removePartner, id)} />
        )}
        {activeTab === "screenshots" && (
          <ScreenshotsWidget listing={listing} onRemove={(id) => handleRemove(removeScreenshot, id)} />
        )}
        {activeTab === "datacenters" && (
          <DatacentersWidget listing={listing} onRemove={(id) => handleRemove(removeDatacenterLink, id)} />
        )}
        {activeTab === "news" && (
          <NewsWidget listing={listing} onRemove={(id) => handleRemove(removeNews, id)} />
        )}
        {activeTab === "links" && (
          <ExternalLinksWidget listing={listing} onRemove={(id) => handleRemove(removeExternalLink, id)} />
        )}
        {activeTab === "sources" && (
          <SourcesWidget listing={listing} onRemove={(id) => handleRemove(removeSource, id)} />
        )}
        {activeTab === "coupons" && (
          <CouponsWidget listing={listing} onRemove={(id) => handleRemove(removeCoupon, id)} />
        )}
        {activeTab === "degrees" && (
          <DegreesWidget listing={listing} onRemove={(id) => handleRemove(removeDegree, id)} />
        )}
      </div>
    </div>
  );
}

// ── Widget Sub-components ──────────────────────────────────

function WidgetShell({
  children,
  items,
  renderItem,
}: {
  children: React.ReactNode;
  items: { id: string; label: string }[];
  renderItem?: (item: { id: string; label: string }) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) =>
            renderItem ? (
              <div key={item.id}>{renderItem(item)}</div>
            ) : (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                {item.label}
              </div>
            )
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function ItemRow({
  label,
  sublabel,
  onRemove,
}: {
  label: string;
  sublabel?: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
      <div>
        <span className="font-medium">{label}</span>
        {sublabel && (
          <span className="ml-2 text-muted-foreground">{sublabel}</span>
        )}
      </div>
      <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function OfficesWidget({
  listing,
  onRemove,
}: {
  listing: ListingWithWidgets;
  onRemove: (id: string) => void;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addOffice({
      listingId: listing.id,
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      country: fd.get("country") as string,
      postalCode: fd.get("postalCode") as string,
      isHq: fd.get("isHq") === "on",
      label: fd.get("label") as string,
    });
    if (result.error) toast.error(result.error);
    else {
      setAdding(false);
      router.refresh();
    }
  }

  return (
    <WidgetShell items={[]}>
      {listing.offices.map((o) => (
        <ItemRow
          key={o.id}
          label={o.label || o.address}
          sublabel={[o.city, o.state, o.country].filter(Boolean).join(", ")}
          onRemove={() => onRemove(o.id)}
        />
      ))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Address*</Label>
              <Input name="address" required />
            </div>
            <div className="space-y-1">
              <Label>Label</Label>
              <Input name="label" placeholder="e.g. HQ" />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input name="city" />
            </div>
            <div className="space-y-1">
              <Label>State</Label>
              <Input name="state" />
            </div>
            <div className="space-y-1">
              <Label>Country</Label>
              <Input name="country" />
            </div>
            <div className="space-y-1">
              <Label>Postal Code</Label>
              <Input name="postalCode" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isHq" /> Headquarters
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Add</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Office
        </Button>
      )}
    </WidgetShell>
  );
}

function PeopleWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addPerson({
      listingId: listing.id,
      name: fd.get("name") as string,
      title: fd.get("title") as string,
      role: fd.get("role") as string,
    });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.people.map((p) => (
        <ItemRow key={p.id} label={p.name} sublabel={p.title ?? undefined} onRemove={() => onRemove(p.id)} />
      ))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1"><Label>Name*</Label><Input name="name" required /></div>
            <div className="space-y-1"><Label>Title</Label><Input name="title" /></div>
            <div className="space-y-1"><Label>Role</Label><Input name="role" placeholder="e.g. Founder, CEO" /></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Add</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Person</Button>
      )}
    </WidgetShell>
  );
}

function ProductsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addProduct({
      listingId: listing.id,
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      isCustom,
    });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.products.map((p) => (
        <ItemRow key={p.id} label={p.name} sublabel={p.isCustom ? "(custom)" : undefined} onRemove={() => onRemove(p.id)} />
      ))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="space-y-1">
            <Label>Product</Label>
            {!isCustom ? (
              <select name="name" className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm" required>
                <option value="">Select a product...</option>
                {(PRODUCTS_BY_CATEGORY[listing.category as Exclude<Category, "person">] ?? []).map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            ) : (
              <Input name="name" placeholder="Custom product name" required />
            )}
            <button type="button" className="text-xs text-primary hover:underline" onClick={() => setIsCustom(!isCustom)}>
              {isCustom ? "Use predefined" : "Add custom"}
            </button>
          </div>
          <div className="space-y-1"><Label>Description</Label><Input name="description" /></div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Add</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Product</Button>
      )}
    </WidgetShell>
  );
}

function MilestonesWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addMilestone({ listingId: listing.id, title: fd.get("title") as string, description: fd.get("description") as string, date: fd.get("date") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.milestones.map((m) => (<ItemRow key={m.id} label={m.title} sublabel={m.date ?? undefined} onRemove={() => onRemove(m.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Title*</Label><Input name="title" required /></div>
            <div className="space-y-1"><Label>Date</Label><Input name="date" placeholder="e.g. 2020-01" /></div>
          </div>
          <div className="space-y-1"><Label>Description</Label><Input name="description" /></div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Milestone</Button>
      )}
    </WidgetShell>
  );
}

function VideosWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addVideo({ listingId: listing.id, url: fd.get("url") as string, title: fd.get("title") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.videos.map((v) => (<ItemRow key={v.id} label={v.title || v.url} onRemove={() => onRemove(v.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>URL*</Label><Input name="url" type="url" required /></div>
            <div className="space-y-1"><Label>Title</Label><Input name="title" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Video</Button>
      )}
    </WidgetShell>
  );
}

function TagsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addTag({ listingId: listing.id, tag: fd.get("tag") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      <div className="flex flex-wrap gap-2">
        {listing.tags.map((t) => (
          <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
            {t.tag}
            <button onClick={() => onRemove(t.id)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      {adding ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input name="tag" placeholder="Tag name" required className="max-w-xs" />
          <Button type="submit" size="sm">Add</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Tag</Button>
      )}
    </WidgetShell>
  );
}

function FundingWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addFunding({ listingId: listing.id, roundName: fd.get("roundName") as string, amount: fd.get("amount") as string, date: fd.get("date") as string, investors: fd.get("investors") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.funding.map((f) => (<ItemRow key={f.id} label={f.roundName || "Funding Round"} sublabel={f.amount ?? undefined} onRemove={() => onRemove(f.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Round Name</Label><Input name="roundName" placeholder="e.g. Series A" /></div>
            <div className="space-y-1"><Label>Amount</Label><Input name="amount" placeholder="e.g. $10M" /></div>
            <div className="space-y-1"><Label>Date</Label><Input name="date" placeholder="e.g. 2020-03" /></div>
            <div className="space-y-1"><Label>Investors</Label><Input name="investors" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Funding Round</Button>
      )}
    </WidgetShell>
  );
}

function AcquisitionsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addAcquisition({ listingId: listing.id, acquiredCompany: fd.get("acquiredCompany") as string, date: fd.get("date") as string, price: fd.get("price") as string, description: fd.get("description") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.acquisitions.map((a) => (<ItemRow key={a.id} label={a.acquiredCompany} sublabel={a.price ?? undefined} onRemove={() => onRemove(a.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Acquired Company*</Label><Input name="acquiredCompany" required /></div>
            <div className="space-y-1"><Label>Price</Label><Input name="price" /></div>
            <div className="space-y-1"><Label>Date</Label><Input name="date" /></div>
            <div className="space-y-1"><Label>Description</Label><Input name="description" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Acquisition</Button>
      )}
    </WidgetShell>
  );
}

function ExitsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addExit({ listingId: listing.id, exitType: fd.get("exitType") as string, date: fd.get("date") as string, amount: fd.get("amount") as string, acquirer: fd.get("acquirer") as string, description: fd.get("description") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.exits.map((e) => (<ItemRow key={e.id} label={e.exitType} sublabel={e.acquirer ?? undefined} onRemove={() => onRemove(e.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Exit Type*</Label><Input name="exitType" required placeholder="e.g. IPO, Acquisition" /></div>
            <div className="space-y-1"><Label>Amount</Label><Input name="amount" /></div>
            <div className="space-y-1"><Label>Acquirer</Label><Input name="acquirer" /></div>
            <div className="space-y-1"><Label>Date</Label><Input name="date" /></div>
          </div>
          <div className="space-y-1"><Label>Description</Label><Input name="description" /></div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Exit</Button>
      )}
    </WidgetShell>
  );
}

function PartnersWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addPartner({ listingId: listing.id, partnerName: fd.get("partnerName") as string, description: fd.get("description") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.partners.map((p) => (<ItemRow key={p.id} label={p.partnerName} onRemove={() => onRemove(p.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Partner Name*</Label><Input name="partnerName" required /></div>
            <div className="space-y-1"><Label>Description</Label><Input name="description" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Partner</Button>
      )}
    </WidgetShell>
  );
}

function ScreenshotsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addScreenshot({ listingId: listing.id, imageUrl: fd.get("imageUrl") as string, caption: fd.get("caption") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.screenshots.map((s) => (<ItemRow key={s.id} label={s.caption || s.imageUrl} onRemove={() => onRemove(s.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Image URL*</Label><Input name="imageUrl" type="url" required /></div>
            <div className="space-y-1"><Label>Caption</Label><Input name="caption" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : listing.screenshots.length >= 2 ? (
        <p className="text-sm text-muted-foreground">Maximum 2 screenshots reached.</p>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Screenshot</Button>
      )}
    </WidgetShell>
  );
}

function DatacentersWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addDatacenterLink({ listingId: listing.id, datacenterName: fd.get("datacenterName") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.datacenterLinks.map((d) => (<ItemRow key={d.id} label={d.datacenterName} onRemove={() => onRemove(d.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input name="datacenterName" placeholder="Datacenter name" required className="max-w-xs" />
          <Button type="submit" size="sm">Add</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Datacenter</Button>
      )}
    </WidgetShell>
  );
}

function NewsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addNews({ listingId: listing.id, title: fd.get("title") as string, url: fd.get("url") as string, source: fd.get("source") as string, date: fd.get("date") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.news.map((n) => (<ItemRow key={n.id} label={n.title} sublabel={n.source ?? undefined} onRemove={() => onRemove(n.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Title*</Label><Input name="title" required /></div>
            <div className="space-y-1"><Label>URL</Label><Input name="url" type="url" /></div>
            <div className="space-y-1"><Label>Source</Label><Input name="source" /></div>
            <div className="space-y-1"><Label>Date</Label><Input name="date" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add News</Button>
      )}
    </WidgetShell>
  );
}

function ExternalLinksWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addExternalLink({ listingId: listing.id, title: fd.get("title") as string, url: fd.get("url") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.externalLinks.map((l) => (<ItemRow key={l.id} label={l.title} sublabel={l.url} onRemove={() => onRemove(l.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <Input name="title" placeholder="Title" required className="max-w-xs" />
          <Input name="url" type="url" placeholder="URL" required className="max-w-xs" />
          <Button type="submit" size="sm">Add</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Link</Button>
      )}
    </WidgetShell>
  );
}

function SourcesWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addSource({ listingId: listing.id, title: fd.get("title") as string, url: fd.get("url") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.sources.map((s) => (<ItemRow key={s.id} label={s.title || s.url} onRemove={() => onRemove(s.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <Input name="title" placeholder="Title (optional)" className="max-w-xs" />
          <Input name="url" type="url" placeholder="URL" required className="max-w-xs" />
          <Button type="submit" size="sm">Add</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Source</Button>
      )}
    </WidgetShell>
  );
}

function CouponsWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addCoupon({ listingId: listing.id, code: fd.get("code") as string, discount: fd.get("discount") as string, expiresAt: fd.get("expiresAt") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.coupons.map((c) => (<ItemRow key={c.id} label={c.code} sublabel={c.discount} onRemove={() => onRemove(c.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1"><Label>Code*</Label><Input name="code" required /></div>
            <div className="space-y-1"><Label>Discount*</Label><Input name="discount" required /></div>
            <div className="space-y-1"><Label>Expires</Label><Input name="expiresAt" type="date" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Coupon</Button>
      )}
    </WidgetShell>
  );
}

function DegreesWidget({ listing, onRemove }: { listing: ListingWithWidgets; onRemove: (id: string) => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await addDegree({ listingId: listing.id, institution: fd.get("institution") as string, subject: fd.get("subject") as string, degreeType: fd.get("degreeType") as string, graduationYear: fd.get("graduationYear") as string });
    if (result.error) toast.error(result.error);
    else { setAdding(false); router.refresh(); }
  }
  return (
    <WidgetShell items={[]}>
      {listing.personDegrees.map((d) => (<ItemRow key={d.id} label={d.institution} sublabel={[d.degreeType, d.subject].filter(Boolean).join(" in ")} onRemove={() => onRemove(d.id)} />))}
      {adding ? (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Institution*</Label><Input name="institution" required /></div>
            <div className="space-y-1"><Label>Subject</Label><Input name="subject" /></div>
            <div className="space-y-1"><Label>Degree Type</Label><Input name="degreeType" placeholder="e.g. B.S., M.A., Ph.D." /></div>
            <div className="space-y-1"><Label>Graduation Year</Label><Input name="graduationYear" /></div>
          </div>
          <div className="flex gap-2"><Button type="submit" size="sm">Add</Button><Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>Cancel</Button></div>
        </form>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Degree</Button>
      )}
    </WidgetShell>
  );
}
