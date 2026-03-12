import { z } from "zod/v4";

export const officeSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  isHq: z.boolean().default(false),
  label: z.string().optional(),
});

export const personLinkSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  personListingId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  role: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  isCustom: z.boolean().default(false),
});

export const milestoneSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().optional(),
});

export const videoSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  url: z.string().url("Invalid URL"),
  title: z.string().optional(),
});

export const tagSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  tag: z.string().min(1, "Tag is required"),
});

export const fundingSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  roundName: z.string().optional(),
  amount: z.string().optional(),
  date: z.string().optional(),
  investors: z.string().optional(),
});

export const acquisitionSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  acquiredCompany: z.string().min(1, "Company name is required"),
  date: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
});

export const exitSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  exitType: z.string().min(1, "Exit type is required"),
  date: z.string().optional(),
  amount: z.string().optional(),
  acquirer: z.string().optional(),
  description: z.string().optional(),
});

export const partnerSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  partnerName: z.string().min(1, "Partner name is required"),
  partnerListingId: z.string().optional(),
  description: z.string().optional(),
});

export const screenshotSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  imageUrl: z.string().url("Invalid URL"),
  caption: z.string().optional(),
});

export const datacenterLinkSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  datacenterListingId: z.string().optional(),
  datacenterName: z.string().min(1, "Datacenter name is required"),
});

export const newsSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  source: z.string().optional(),
  date: z.string().optional(),
});

export const externalLinkSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
});

export const sourceSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  title: z.string().optional(),
  url: z.string().url("Invalid URL"),
});

export const couponSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  code: z.string().min(1, "Coupon code is required"),
  discount: z.string().min(1, "Discount description is required"),
  expiresAt: z.string().optional(),
});

export const degreeSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  institution: z.string().min(1, "Institution is required"),
  subject: z.string().optional(),
  degreeType: z.string().optional(),
  graduationYear: z.string().optional(),
});

export const ipRangeSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  type: z.enum(["ipv4", "ipv6"]),
  cidr: z.string().min(1, "CIDR is required"),
  description: z.string().optional(),
});

export const controlPanelSchema = z.object({
  id: z.string().optional(),
  listingId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  version: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export type IpRangeInput = z.infer<typeof ipRangeSchema>;
export type ControlPanelInput = z.infer<typeof controlPanelSchema>;

export type OfficeInput = z.infer<typeof officeSchema>;
export type PersonLinkInput = z.infer<typeof personLinkSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type FundingInput = z.infer<typeof fundingSchema>;
export type AcquisitionInput = z.infer<typeof acquisitionSchema>;
export type ExitInput = z.infer<typeof exitSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type ScreenshotInput = z.infer<typeof screenshotSchema>;
export type DatacenterLinkInput = z.infer<typeof datacenterLinkSchema>;
export type NewsInput = z.infer<typeof newsSchema>;
export type ExternalLinkInput = z.infer<typeof externalLinkSchema>;
export type SourceInput = z.infer<typeof sourceSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type DegreeInput = z.infer<typeof degreeSchema>;
