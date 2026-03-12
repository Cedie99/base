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
import { ListEditor } from "./list-editor";
import {
  type PeopleEntry, emptyPerson, PEOPLE_FIELDS,
  type MilestoneEntry, emptyMilestone, MILESTONE_FIELDS,
  type VideoEntry, emptyVideo, VIDEO_FIELDS,
  type TagEntry, emptyTag, TAG_FIELDS,
  type FundingEntry, emptyFunding, FUNDING_FIELDS,
  type AcquisitionEntry, emptyAcquisition, ACQUISITION_FIELDS,
  type ExitEntry, emptyExit, EXIT_FIELDS,
  type PartnerEntry, emptyPartner, PARTNER_FIELDS,
  type ScreenshotEntry, emptyScreenshot, SCREENSHOT_FIELDS,
  type DatacenterLinkEntry, emptyDatacenterLink, DATACENTER_LINK_FIELDS,
  type NewsEntry, emptyNews, NEWS_FIELDS,
  type ExternalLinkEntry, emptyExternalLink, EXTERNAL_LINK_FIELDS,
  type SourceEntry, emptySource, SOURCE_FIELDS,
  type CouponEntry, emptyCoupon, COUPON_FIELDS,
  type DegreeEntry, emptyDegree, DEGREE_FIELDS,
  type IpRangeEntry, emptyIpRange, IP_RANGE_FIELDS,
  type ControlPanelEntry, emptyControlPanel, CONTROL_PANEL_FIELDS,
} from "./widget-configs";
import type { LucideIcon } from "lucide-react";
import {
  Info,
  Building2,
  FileText,
  User,
  MapPin,
  Package,
  Users,
  Camera,
  Handshake,
  DollarSign,
  TrendingUp,
  LogOut,
  Server,
  Ticket,
  GraduationCap,
  Flag,
  Video,
  Tag,
  Newspaper,
  ExternalLink,
  BookOpen,
  Network,
  Shield,
  Leaf,
} from "lucide-react";

const companyStatuses = [
  { value: "", label: "Select status..." },
  { value: "privately_held", label: "Privately Held" },
  { value: "publicly_held", label: "Publicly Held" },
  { value: "acquired", label: "Acquired" },
  { value: "out_of_business", label: "Out of Business" },
];

function extractDomain(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const initialState: ActionState = {};

function FormSection({
  icon: Icon,
  title,
  description,
  children,
  fullWidth,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "lg:col-span-2" : ""}>
      <div className="rounded-lg border bg-card p-6 space-y-4 h-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function SubmissionForm({
  category,
  listing,
  onSuccess,
}: {
  category: Category;
  listing?: ListingWithWidgets;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const isEdit = !!listing;
  const action = isEdit ? submitListingEdit : submitListing;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(listing?.name ?? "");
  const [slug, setSlug] = useState(listing?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(!isEdit);
  const [companyStatusValue, setCompanyStatusValue] = useState(
    listing?.companyStatus ?? ""
  );
  const [logoUrl, setLogoUrl] = useState(listing?.logoUrl ?? "");
  const [autoLogo, setAutoLogo] = useState(!isEdit || !listing?.logoUrl);

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

  const [people, setPeople] = useState<PeopleEntry[]>(() => {
    if (!listing?.people) return [];
    return listing.people.map((p) => ({ name: p.name, title: p.title ?? "", role: p.role ?? "" }));
  });

  const [milestones, setMilestones] = useState<MilestoneEntry[]>(() => {
    if (!listing?.milestones) return [];
    return listing.milestones.map((m) => ({ title: m.title, description: m.description ?? "", date: m.date ?? "" }));
  });

  const [videos, setVideos] = useState<VideoEntry[]>(() => {
    if (!listing?.videos) return [];
    return listing.videos.map((v) => ({ url: v.url, title: v.title ?? "" }));
  });

  const [tags, setTags] = useState<TagEntry[]>(() => {
    if (!listing?.tags) return [];
    return listing.tags.map((t) => ({ tag: t.tag }));
  });

  const [funding, setFunding] = useState<FundingEntry[]>(() => {
    if (!listing?.funding) return [];
    return listing.funding.map((f) => ({ roundName: f.roundName ?? "", amount: f.amount ?? "", date: f.date ?? "", investors: f.investors ?? "" }));
  });

  const [acquisitions, setAcquisitions] = useState<AcquisitionEntry[]>(() => {
    if (!listing?.acquisitions) return [];
    return listing.acquisitions.map((a) => ({ acquiredCompany: a.acquiredCompany, date: a.date ?? "", price: a.price ?? "", description: a.description ?? "" }));
  });

  const [exits, setExits] = useState<ExitEntry[]>(() => {
    if (!listing?.exits) return [];
    return listing.exits.map((e) => ({ exitType: e.exitType, date: e.date ?? "", amount: e.amount ?? "", acquirer: e.acquirer ?? "", description: e.description ?? "" }));
  });

  const [partners, setPartners] = useState<PartnerEntry[]>(() => {
    if (!listing?.partners) return [];
    return listing.partners.map((p) => ({ partnerName: p.partnerName, description: p.description ?? "" }));
  });

  const [screenshots, setScreenshots] = useState<ScreenshotEntry[]>(() => {
    if (!listing?.screenshots) return [];
    return listing.screenshots.map((s) => ({ imageUrl: s.imageUrl, caption: s.caption ?? "" }));
  });

  const [datacenterLinks, setDatacenterLinks] = useState<DatacenterLinkEntry[]>(() => {
    if (!listing?.datacenterLinks) return [];
    return listing.datacenterLinks.map((d) => ({ datacenterName: d.datacenterName }));
  });

  const [news, setNews] = useState<NewsEntry[]>(() => {
    if (!listing?.news) return [];
    return listing.news.map((n) => ({ title: n.title, url: n.url ?? "", source: n.source ?? "", date: n.date ?? "" }));
  });

  const [externalLinks, setExternalLinks] = useState<ExternalLinkEntry[]>(() => {
    if (!listing?.externalLinks) return [];
    return listing.externalLinks.map((l) => ({ title: l.title, url: l.url }));
  });

  const [sources, setSources] = useState<SourceEntry[]>(() => {
    if (!listing?.sources) return [];
    return listing.sources.map((s) => ({ title: s.title ?? "", url: s.url }));
  });

  const [coupons, setCoupons] = useState<CouponEntry[]>(() => {
    if (!listing?.coupons) return [];
    return listing.coupons.map((c) => ({ code: c.code, discount: c.discount, expiresAt: c.expiresAt ?? "" }));
  });

  const [degrees, setDegrees] = useState<DegreeEntry[]>(() => {
    if (!listing?.personDegrees) return [];
    return listing.personDegrees.map((d) => ({ institution: d.institution, subject: d.subject ?? "", degreeType: d.degreeType ?? "", graduationYear: d.graduationYear ?? "" }));
  });

  const [ipRanges, setIpRanges] = useState<IpRangeEntry[]>(() => {
    if (!listing?.ipRanges) return [];
    return listing.ipRanges.map((r) => ({ type: r.type, cidr: r.cidr, description: r.description ?? "" }));
  });

  const [controlPanels, setControlPanels] = useState<ControlPanelEntry[]>(() => {
    if (!listing?.controlPanels) return [];
    return listing.controlPanels.map((c) => ({ name: c.name, version: c.version ?? "", isDefault: c.isDefault }));
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
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/${CATEGORY_URL_PREFIX[category]}/${slug}`);
      }
    }
    if (state.success && isEdit) {
      toast.success("Edit submitted for review!");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(
          `/${CATEGORY_URL_PREFIX[category]}/${listing?.slug}`
        );
      }
    }
  }, [state, isEdit, router, category, slug, listing?.slug, onSuccess]);

  const isPerson = category === "person";
  const isCompany = category === "company";
  const isDatacenter = category === "datacenter";
  const isRegistrar = category === "registrar";
  const isNonPerson = !isPerson;

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hidden inputs */}
      <div className="hidden">
        <input type="hidden" name="category" value={category} />
        {isEdit && <input type="hidden" name="id" value={listing.id} />}
        <input type="hidden" name="slug" value={slug} />
        {isNonPerson && (
          <>
            <input type="hidden" name="__offices" value={JSON.stringify(offices.filter((o) => o.address.trim()))} />
            <input type="hidden" name="__products" value={JSON.stringify(selectedProducts.map((name) => ({ name })))} />
            <input type="hidden" name="__people" value={JSON.stringify(people.filter((p) => p.name.trim()))} />
            <input type="hidden" name="__screenshots" value={JSON.stringify(screenshots.filter((s) => s.imageUrl.trim()))} />
            <input type="hidden" name="__partners" value={JSON.stringify(partners.filter((p) => p.partnerName.trim()))} />
            <input type="hidden" name="__funding" value={JSON.stringify(funding.filter((f) => f.roundName.trim() || f.amount.trim()))} />
            <input type="hidden" name="__acquisitions" value={JSON.stringify(acquisitions.filter((a) => a.acquiredCompany.trim()))} />
            <input type="hidden" name="__exits" value={JSON.stringify(exits.filter((e) => e.exitType.trim()))} />
          </>
        )}
        {isCompany && (
          <input type="hidden" name="__datacenterLinks" value={JSON.stringify(datacenterLinks.filter((d) => d.datacenterName.trim()))} />
        )}
        {(isCompany || isDatacenter) && (
          <>
            <input type="hidden" name="__ipRanges" value={JSON.stringify(ipRanges.filter((r) => r.cidr.trim()))} />
            <input type="hidden" name="__controlPanels" value={JSON.stringify(controlPanels.filter((c) => c.name.trim()))} />
          </>
        )}
        {(isCompany || isRegistrar) && (
          <input type="hidden" name="__coupons" value={JSON.stringify(coupons.filter((c) => c.code.trim()))} />
        )}
        {isPerson && (
          <input type="hidden" name="__degrees" value={JSON.stringify(degrees.filter((d) => d.institution.trim()))} />
        )}
        <input type="hidden" name="__milestones" value={JSON.stringify(milestones.filter((m) => m.title.trim()))} />
        <input type="hidden" name="__videos" value={JSON.stringify(videos.filter((v) => v.url.trim()))} />
        <input type="hidden" name="__tags" value={JSON.stringify(tags.filter((t) => t.tag.trim()))} />
        <input type="hidden" name="__news" value={JSON.stringify(news.filter((n) => n.title.trim()))} />
        <input type="hidden" name="__externalLinks" value={JSON.stringify(externalLinks.filter((l) => l.title.trim() || l.url.trim()))} />
        <input type="hidden" name="__sources" value={JSON.stringify(sources.filter((s) => s.url.trim()))} />
      </div>

      {/* ===== Basic Info — full width ===== */}
      <FormSection
        icon={Info}
        title={isEdit ? `Edit ${listing.name}` : `Add ${CATEGORY_SINGULAR[category]}`}
        description="Identify this listing with a unique name."
        fullWidth
      >
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
        </div>
      </FormSection>

      {/* ===== Non-Person: General Info (left) | Overview & Logo (right) ===== */}
      {isNonPerson && (
        <>
          <FormSection
            icon={Building2}
            title="General Information"
            description="Key details about the organization."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name</Label>
                <Input id="legalName" name="legalName" defaultValue={listing?.legalName ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  defaultValue={listing?.url ?? ""}
                  onChange={(e) => {
                    if (autoLogo) {
                      const domain = extractDomain(e.target.value);
                      if (domain) {
                        setLogoUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                      }
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogUrl">Blog URL</Label>
                <Input id="blogUrl" name="blogUrl" type="url" defaultValue={listing?.blogUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogFeedUrl">Blog Feed URL</Label>
                <Input id="blogFeedUrl" name="blogFeedUrl" type="url" defaultValue={listing?.blogFeedUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUsername">Twitter</Label>
                <Input id="twitterUsername" name="twitterUsername" defaultValue={listing?.twitterUsername ?? ""} />
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
              {isCompany && (
                <div className="space-y-2">
                  <Label htmlFor="servers">Servers</Label>
                  <Input id="servers" name="servers" type="number" defaultValue={listing?.servers ?? ""} />
                </div>
              )}
              {(isCompany || isRegistrar) && (
                <div className="space-y-2">
                  <Label htmlFor="domainsManaged">Domains Under Management</Label>
                  <Input id="domainsManaged" name="domainsManaged" type="number" defaultValue={listing?.domainsManaged ?? ""} />
                </div>
              )}
              {isCompany && (
                <div className="space-y-2">
                  <Label htmlFor="clients">Clients</Label>
                  <Input id="clients" name="clients" type="number" defaultValue={listing?.clients ?? ""} />
                </div>
              )}
              {isDatacenter && (
                <div className="space-y-2">
                  <Label htmlFor="numberOfDatacenters">Number of Data Centers</Label>
                  <Input id="numberOfDatacenters" name="numberOfDatacenters" type="number" defaultValue={listing?.numberOfDatacenters ?? ""} />
                </div>
              )}
              {isDatacenter && (
                <div className="space-y-2">
                  <Label htmlFor="totalSquareFootage">Total Square Footage</Label>
                  <Input id="totalSquareFootage" name="totalSquareFootage" defaultValue={listing?.totalSquareFootage ?? ""} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="foundingDate">Founding Date</Label>
                <Input id="foundingDate" name="foundingDate" placeholder="e.g. 2002" defaultValue={listing?.foundingDate ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyStatus">Status</Label>
                <select
                  id="companyStatus"
                  name="companyStatus"
                  value={companyStatusValue}
                  onChange={(e) => setCompanyStatusValue(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
                >
                  {companyStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              {companyStatusValue === "publicly_held" && (
                <div className="space-y-2">
                  <Label htmlFor="stockTicker">Stock Ticker</Label>
                  <Input id="stockTicker" name="stockTicker" placeholder="e.g. GOOG" defaultValue={listing?.stockTicker ?? ""} />
                </div>
              )}
              {(isCompany || isDatacenter) && (
                <div className="space-y-2">
                  <Label htmlFor="asnNumber">ASN Number</Label>
                  <Input id="asnNumber" name="asnNumber" placeholder="e.g. AS13335" defaultValue={listing?.asnNumber ?? ""} />
                </div>
              )}
              {(isCompany || isDatacenter) && (
                <div className="space-y-2">
                  <Label htmlFor="uptimeGuarantee">Uptime Guarantee</Label>
                  <Input id="uptimeGuarantee" name="uptimeGuarantee" placeholder="e.g. 99.99%" defaultValue={listing?.uptimeGuarantee ?? ""} />
                </div>
              )}
              {(isCompany || isDatacenter) && (
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="greenEnergyCertified"
                      name="greenEnergyCertified"
                      defaultChecked={listing?.greenEnergyCertified ?? false}
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="greenEnergyCertified">Green Energy Certified</Label>
                  </div>
                  <Input
                    id="greenEnergyDetails"
                    name="greenEnergyDetails"
                    placeholder="e.g. 100% renewable, EPA Green Power Partner"
                    defaultValue={listing?.greenEnergyDetails ?? ""}
                  />
                </div>
              )}
            </div>
          </FormSection>

          <FormSection
            icon={FileText}
            title="Overview & Logo"
            description="Describe what this organization does."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overview">Overview</Label>
                <textarea
                  id="overview"
                  name="overview"
                  rows={6}
                  defaultValue={listing?.overview ?? ""}
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setAutoLogo(false);
                  }}
                />
                {autoLogo && logoUrl && (
                  <p className="text-xs text-muted-foreground">Auto-detected from website URL</p>
                )}
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-12 w-12 rounded-lg border object-contain bg-white p-1"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    onLoad={(e) => { e.currentTarget.style.display = "block"; }}
                  />
                )}
              </div>
            </div>
          </FormSection>
        </>
      )}

      {/* ===== Person: Info (left) | Overview & Photo (right) ===== */}
      {isPerson && (
        <>
          <FormSection
            icon={User}
            title="Person Information"
            description="Personal and contact details."
          >
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
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={listing?.phone ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={listing?.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homepageUrl">Homepage URL</Label>
                <Input id="homepageUrl" name="homepageUrl" type="url" defaultValue={listing?.homepageUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogUrl">Blog URL</Label>
                <Input id="blogUrl" name="blogUrl" type="url" defaultValue={listing?.blogUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogFeedUrl">Blog Feed URL</Label>
                <Input id="blogFeedUrl" name="blogFeedUrl" type="url" defaultValue={listing?.blogFeedUrl ?? ""} />
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
            </div>
          </FormSection>

          <FormSection
            icon={FileText}
            title="Overview & Photo"
            description="Write a biography or summary."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="overview">Overview</Label>
                <textarea
                  id="overview"
                  name="overview"
                  rows={6}
                  defaultValue={listing?.overview ?? ""}
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input id="photoUrl" name="photoUrl" type="url" defaultValue={listing?.photoUrl ?? ""} />
              </div>
            </div>
          </FormSection>
        </>
      )}

      {/* ===== Non-Person Widgets ===== */}
      {isNonPerson && (
        <>
          {/* Offices | People */}
          <div>
            <OfficesEditor offices={offices} onChange={setOffices} />
          </div>
          <div>
            <ListEditor<PeopleEntry>
              title="People" singularLabel="Person" fields={PEOPLE_FIELDS}
              items={people} onChange={setPeople} emptyItem={emptyPerson}
              icon={Users} description="Key people in this organization."
            />
          </div>

          {/* Products & Services — full width */}
          <div className="lg:col-span-2">
            <ProductsEditor
              category={category as Exclude<Category, "person">}
              selected={selectedProducts}
              onChange={setSelectedProducts}
            />
          </div>

          {/* Screenshots | Partners */}
          <div>
            <ListEditor<ScreenshotEntry>
              title="Screenshots" singularLabel="Screenshot" fields={SCREENSHOT_FIELDS}
              items={screenshots} onChange={setScreenshots} emptyItem={emptyScreenshot}
              icon={Camera} description="Website screenshots or product images."
            />
          </div>
          <div>
            <ListEditor<PartnerEntry>
              title="Partners" singularLabel="Partner" fields={PARTNER_FIELDS}
              items={partners} onChange={setPartners} emptyItem={emptyPartner}
              icon={Handshake} description="Strategic partnerships and alliances."
            />
          </div>

          {/* Funding Rounds | Acquisitions */}
          <div>
            <ListEditor<FundingEntry>
              title="Funding Rounds" singularLabel="Round" fields={FUNDING_FIELDS}
              items={funding} onChange={setFunding} emptyItem={emptyFunding}
              icon={DollarSign} description="Investment rounds and funding history."
            />
          </div>
          <div>
            <ListEditor<AcquisitionEntry>
              title="Acquisitions" singularLabel="Acquisition" fields={ACQUISITION_FIELDS}
              items={acquisitions} onChange={setAcquisitions} emptyItem={emptyAcquisition}
              icon={TrendingUp} description="Companies acquired by this organization."
            />
          </div>

          {/* Exits | Datacenter Links (company) or next widget */}
          <div>
            <ListEditor<ExitEntry>
              title="Exits" singularLabel="Exit" fields={EXIT_FIELDS}
              items={exits} onChange={setExits} emptyItem={emptyExit}
              icon={LogOut} description="IPOs, acquisitions, or other exit events."
            />
          </div>
          {isCompany && (
            <div>
              <ListEditor<DatacenterLinkEntry>
                title="Datacenter Links" singularLabel="Datacenter" fields={DATACENTER_LINK_FIELDS}
                items={datacenterLinks} onChange={setDatacenterLinks} emptyItem={emptyDatacenterLink}
                icon={Server} description="Data centers used by this company."
              />
            </div>
          )}

          {/* Coupons (company + registrar) */}
          {(isCompany || isRegistrar) && (
            <div>
              <ListEditor<CouponEntry>
                title="Coupons" singularLabel="Coupon" fields={COUPON_FIELDS}
                items={coupons} onChange={setCoupons} emptyItem={emptyCoupon}
                icon={Ticket} description="Active discount codes and promotions."
              />
            </div>
          )}

          {/* IP Ranges & Control Panels (company + datacenter) */}
          {(isCompany || isDatacenter) && (
            <>
              <div>
                <ListEditor<IpRangeEntry>
                  title="IP Ranges" singularLabel="IP Range" fields={IP_RANGE_FIELDS}
                  items={ipRanges} onChange={setIpRanges} emptyItem={emptyIpRange}
                  icon={Network} description="IP address ranges owned by this organization."
                />
              </div>
              <div>
                <ListEditor<ControlPanelEntry>
                  title="Control Panels" singularLabel="Panel" fields={CONTROL_PANEL_FIELDS}
                  items={controlPanels} onChange={setControlPanels} emptyItem={emptyControlPanel}
                  icon={Shield} description="Hosting control panels supported."
                />
              </div>
            </>
          )}
        </>
      )}

      {/* ===== Person: Degrees ===== */}
      {isPerson && (
        <div>
          <ListEditor<DegreeEntry>
            title="Degrees" singularLabel="Degree" fields={DEGREE_FIELDS}
            items={degrees} onChange={setDegrees} emptyItem={emptyDegree}
            icon={GraduationCap} description="Educational background and qualifications."
          />
        </div>
      )}

      {/* ===== Universal Widgets (all categories) ===== */}
      {/* Milestones | Videos */}
      <div>
        <ListEditor<MilestoneEntry>
          title="Milestones" singularLabel="Milestone" fields={MILESTONE_FIELDS}
          items={milestones} onChange={setMilestones} emptyItem={emptyMilestone}
          icon={Flag} description="Important events in the timeline."
        />
      </div>
      <div>
        <ListEditor<VideoEntry>
          title="Videos" singularLabel="Video" fields={VIDEO_FIELDS}
          items={videos} onChange={setVideos} emptyItem={emptyVideo}
          icon={Video} description="Related video content."
        />
      </div>

      {/* Tags | News */}
      <div>
        <ListEditor<TagEntry>
          title="Tags" singularLabel="Tag" fields={TAG_FIELDS}
          items={tags} onChange={setTags} emptyItem={emptyTag}
          icon={Tag} description="Keywords for search and categorization."
        />
      </div>
      <div>
        <ListEditor<NewsEntry>
          title="News" singularLabel="Article" fields={NEWS_FIELDS}
          items={news} onChange={setNews} emptyItem={emptyNews}
          icon={Newspaper} description="Press coverage and news articles."
        />
      </div>

      {/* External Links | Sources */}
      <div>
        <ListEditor<ExternalLinkEntry>
          title="External Links" singularLabel="Link" fields={EXTERNAL_LINK_FIELDS}
          items={externalLinks} onChange={setExternalLinks} emptyItem={emptyExternalLink}
          icon={ExternalLink} description="Related websites and resources."
        />
      </div>
      <div>
        <ListEditor<SourceEntry>
          title="Sources" singularLabel="Source" fields={SOURCE_FIELDS}
          items={sources} onChange={setSources} emptyItem={emptySource}
          icon={BookOpen} description="References used to verify this data."
        />
      </div>

      {/* ===== Submit — full width ===== */}
      <div className="lg:col-span-2 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Submitting..." : isEdit ? "Submit Edit" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
