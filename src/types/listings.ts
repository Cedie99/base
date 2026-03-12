import type {
  listings,
  listingOffices,
  listingPeople,
  listingProducts,
  listingMilestones,
  listingVideos,
  listingTags,
  listingFunding,
  listingAcquisitions,
  listingExits,
  listingPartners,
  listingScreenshots,
  listingDatacenterLinks,
  listingNews,
  listingExternalLinks,
  listingSources,
  listingCoupons,
  personDegrees,
  listingIpRanges,
  listingControlPanels,
  revisions,
} from "@/lib/db/schema";

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;

export type ListingOffice = typeof listingOffices.$inferSelect;
export type ListingPerson = typeof listingPeople.$inferSelect;
export type ListingProduct = typeof listingProducts.$inferSelect;
export type ListingMilestone = typeof listingMilestones.$inferSelect;
export type ListingVideo = typeof listingVideos.$inferSelect;
export type ListingTag = typeof listingTags.$inferSelect;
export type ListingFunding = typeof listingFunding.$inferSelect;
export type ListingAcquisition = typeof listingAcquisitions.$inferSelect;
export type ListingExit = typeof listingExits.$inferSelect;
export type ListingPartner = typeof listingPartners.$inferSelect;
export type ListingScreenshot = typeof listingScreenshots.$inferSelect;
export type ListingDatacenterLink = typeof listingDatacenterLinks.$inferSelect;
export type ListingNewsItem = typeof listingNews.$inferSelect;
export type ListingExternalLink = typeof listingExternalLinks.$inferSelect;
export type ListingSource = typeof listingSources.$inferSelect;
export type ListingCoupon = typeof listingCoupons.$inferSelect;
export type PersonDegree = typeof personDegrees.$inferSelect;
export type ListingIpRange = typeof listingIpRanges.$inferSelect;
export type ListingControlPanel = typeof listingControlPanels.$inferSelect;
export type Revision = typeof revisions.$inferSelect;

export interface RevisionWithRelations extends Revision {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  listing: {
    id: string;
    name: string;
    slug: string;
    category: Category;
  };
}

export type Category = "company" | "datacenter" | "registrar" | "person";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type CompanyStatus =
  | "privately_held"
  | "publicly_held"
  | "acquired"
  | "out_of_business";

export interface ListingWithWidgets extends Listing {
  offices: ListingOffice[];
  people: ListingPerson[];
  products: ListingProduct[];
  milestones: ListingMilestone[];
  videos: ListingVideo[];
  tags: ListingTag[];
  funding: ListingFunding[];
  acquisitions: ListingAcquisition[];
  exits: ListingExit[];
  partners: ListingPartner[];
  screenshots: ListingScreenshot[];
  datacenterLinks: ListingDatacenterLink[];
  news: ListingNewsItem[];
  externalLinks: ListingExternalLink[];
  sources: ListingSource[];
  coupons: ListingCoupon[];
  personDegrees: PersonDegree[];
  ipRanges: ListingIpRange[];
  controlPanels: ListingControlPanel[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  company: "Companies",
  datacenter: "Data Centers",
  registrar: "Domain Registrars",
  person: "People",
};

export const CATEGORY_SINGULAR: Record<Category, string> = {
  company: "Company",
  datacenter: "Data Center",
  registrar: "Domain Registrar",
  person: "Person",
};

export const CATEGORY_URL_PREFIX: Record<Category, string> = {
  company: "company",
  datacenter: "datacenter",
  registrar: "registrar",
  person: "person",
};

export const CATEGORY_PLURAL_URL: Record<Category, string> = {
  company: "companies",
  datacenter: "datacenters",
  registrar: "registrars",
  person: "people",
};

export const COMPANY_PRODUCTS = [
  "Free Web Hosting",
  "Shared Hosting",
  "Reseller Hosting",
  "Dedicated Hosting",
  "Colocation Hosting",
  "VPS Hosting",
  "Cloud Hosting",
  "E-Commerce Hosting",
  "Domain Name Registration",
  "Domain Name Parking",
  "SSL Certificates",
  "Server Management",
  "E-Mail Hosting",
  "Exchange Hosting",
  "Linux Hosting",
  "Windows Hosting",
  "Backup Service",
  "Custom Development",
  "Script Installation",
  "Search Engine Optimization",
  "Marketing Services",
  "Graphic Design Services",
  "Business Consulting Service",
  "Merchant Gateway",
  "Webmaster Tools",
  "Affiliate Program",
] as const;

export const REGISTRAR_PRODUCTS = [
  "Domain Name Registration",
  "Domain Name Parking",
  "Domain Name Search",
  "Private Whois",
  "Reseller Program",
  "DNS Hosting",
  "Web Hosting",
  "E-Mail Hosting",
  "Domain Name Marketplace",
  "Domain Name Auction",
  "SSL Certificates",
  "Site Builder",
  "Affiliate Program",
  "Custom Development",
  "Search Engine Optimization",
  "Marketing Services",
  "Graphic Design Services",
  "Business Consulting Service",
  "Merchant Gateway",
  "Webmaster Tools",
] as const;

export const DATACENTER_PRODUCTS = [
  "Colocation",
  "Dedicated Hosting",
  "Cloud Hosting",
  "Managed Hosting",
  "Disaster Recovery",
  "Interconnection",
  "Remote Hands",
  "Server Housing",
] as const;

export const PRODUCTS_BY_CATEGORY: Record<Exclude<Category, "person">, readonly string[]> = {
  company: COMPANY_PRODUCTS,
  datacenter: DATACENTER_PRODUCTS,
  registrar: REGISTRAR_PRODUCTS,
};

// Combined unique list for backward compatibility
export const PREDEFINED_PRODUCTS = [
  ...new Set([...COMPANY_PRODUCTS, ...REGISTRAR_PRODUCTS, ...DATACENTER_PRODUCTS]),
] as const;
