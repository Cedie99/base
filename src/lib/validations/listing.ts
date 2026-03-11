import { z } from "zod/v4";

export const categoryValues = [
  "company",
  "datacenter",
  "registrar",
  "person",
] as const;

export const companyStatusValues = [
  "privately_held",
  "publicly_held",
  "acquired",
  "out_of_business",
] as const;

export const createListingSchema = z.object({
  category: z.enum(categoryValues),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),

  // General Info
  legalName: z.string().optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.email("Invalid email").optional().or(z.literal("")),
  employees: z.coerce.number().int().positive().optional().or(z.literal("")),
  servers: z.coerce.number().int().positive().optional().or(z.literal("")),
  domainsManaged: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal("")),
  clients: z.coerce.number().int().positive().optional().or(z.literal("")),
  foundingDate: z.string().optional(),
  companyStatus: z.enum(companyStatusValues).optional().or(z.literal("")),
  overview: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),

  // Additional fields
  blogFeedUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  numberOfDatacenters: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal("")),
  totalSquareFootage: z.string().optional(),
  stockTicker: z.string().optional(),

  // People-specific
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  homepageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  blogUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitterUsername: z.string().optional(),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  facebookUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  tiktokUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  birthplace: z.string().optional(),
  birthdate: z.string().optional(),
  photoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const updateListingSchema = createListingSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
