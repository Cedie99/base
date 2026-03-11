import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  primaryKey,
  integer,
  boolean,
  date,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// ── Enums ──────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "moderator",
  "user",
]);

export const categoryEnum = pgEnum("category", [
  "company",
  "datacenter",
  "registrar",
  "person",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const companyStatusEnum = pgEnum("company_status", [
  "privately_held",
  "publicly_held",
  "acquired",
  "out_of_business",
]);

// ── Users (extended) ───────────────────────────────────────

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("user").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  listings: many(listings),
  revisions: many(revisions, { relationName: "revisionAuthor" }),
  moderatedRevisions: many(revisions, { relationName: "revisionModerator" }),
}));

// ── Auth tables ────────────────────────────────────────────

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ── Listings ───────────────────────────────────────────────

export const listings = pgTable(
  "listing",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    category: categoryEnum("category").notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    approvalStatus: approvalStatusEnum("approval_status")
      .default("pending")
      .notNull(),

    // General Info (Companies / Data Centers / Registrars)
    legalName: text("legal_name"),
    url: text("url"),
    phone: text("phone"),
    email: text("email"),
    employees: integer("employees"),
    servers: integer("servers"),
    domainsManaged: integer("domains_managed"),
    clients: integer("clients"),
    foundingDate: text("founding_date"),
    companyStatus: companyStatusEnum("company_status"),
    overview: text("overview"),
    logoUrl: text("logo_url"),

    // Additional fields
    blogFeedUrl: text("blog_feed_url"),
    numberOfDatacenters: integer("number_of_datacenters"),
    totalSquareFootage: text("total_square_footage"),
    stockTicker: text("stock_ticker"),

    // People-specific fields
    firstName: text("first_name"),
    lastName: text("last_name"),
    homepageUrl: text("homepage_url"),
    blogUrl: text("blog_url"),
    twitterUsername: text("twitter_username"),
    linkedinUrl: text("linkedin_url"),
    facebookUrl: text("facebook_url"),
    instagramUrl: text("instagram_url"),
    tiktokUrl: text("tiktok_url"),
    birthplace: text("birthplace"),
    birthdate: date("birthdate"),
    photoUrl: text("photo_url"),

    // Meta
    createdById: text("created_by_id").references(() => users.id),
    createdByIp: text("created_by_ip"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("listing_category_slug_idx").on(table.category, table.slug),
    index("listing_name_idx").on(table.name),
    index("listing_url_idx").on(table.url),
    index("listing_category_status_idx").on(
      table.category,
      table.approvalStatus
    ),
  ]
);

export const listingsRelations = relations(listings, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [listings.createdById],
    references: [users.id],
  }),
  offices: many(listingOffices),
  people: many(listingPeople, { relationName: "listingPeople" }),
  products: many(listingProducts),
  milestones: many(listingMilestones),
  videos: many(listingVideos),
  tags: many(listingTags),
  funding: many(listingFunding),
  acquisitions: many(listingAcquisitions),
  exits: many(listingExits),
  partners: many(listingPartners, { relationName: "listingPartners" }),
  screenshots: many(listingScreenshots),
  datacenterLinks: many(listingDatacenterLinks, { relationName: "listingDatacenterLinks" }),
  news: many(listingNews),
  externalLinks: many(listingExternalLinks),
  sources: many(listingSources),
  coupons: many(listingCoupons),
  personDegrees: many(personDegrees),
  revisions: many(revisions),
}));

// ── Widget Tables ──────────────────────────────────────────

export const listingOffices = pgTable("listing_office", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  postalCode: text("postal_code"),
  isHq: boolean("is_hq").default(false).notNull(),
  label: text("label"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingOfficesRelations = relations(listingOffices, ({ one }) => ({
  listing: one(listings, {
    fields: [listingOffices.listingId],
    references: [listings.id],
  }),
}));

export const listingPeople = pgTable("listing_person", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  personListingId: text("person_listing_id").references(() => listings.id),
  name: text("name").notNull(),
  title: text("title"),
  role: text("role"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingPeopleRelations = relations(listingPeople, ({ one }) => ({
  listing: one(listings, {
    fields: [listingPeople.listingId],
    references: [listings.id],
    relationName: "listingPeople",
  }),
  personListing: one(listings, {
    fields: [listingPeople.personListingId],
    references: [listings.id],
    relationName: "personLink",
  }),
}));

export const listingProducts = pgTable("listing_product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isCustom: boolean("is_custom").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingProductsRelations = relations(
  listingProducts,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingProducts.listingId],
      references: [listings.id],
    }),
  })
);

export const listingMilestones = pgTable("listing_milestone", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingMilestonesRelations = relations(
  listingMilestones,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingMilestones.listingId],
      references: [listings.id],
    }),
  })
);

export const listingVideos = pgTable("listing_video", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingVideosRelations = relations(listingVideos, ({ one }) => ({
  listing: one(listings, {
    fields: [listingVideos.listingId],
    references: [listings.id],
  }),
}));

export const listingTags = pgTable("listing_tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingTagsRelations = relations(listingTags, ({ one }) => ({
  listing: one(listings, {
    fields: [listingTags.listingId],
    references: [listings.id],
  }),
}));

export const listingFunding = pgTable("listing_funding", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  roundName: text("round_name"),
  amount: text("amount"),
  date: text("date"),
  investors: text("investors"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingFundingRelations = relations(
  listingFunding,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingFunding.listingId],
      references: [listings.id],
    }),
  })
);

export const listingAcquisitions = pgTable("listing_acquisition", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  acquiredCompany: text("acquired_company").notNull(),
  date: text("date"),
  price: text("price"),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingAcquisitionsRelations = relations(
  listingAcquisitions,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingAcquisitions.listingId],
      references: [listings.id],
    }),
  })
);

export const listingExits = pgTable("listing_exit", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  exitType: text("exit_type").notNull(),
  date: text("date"),
  amount: text("amount"),
  acquirer: text("acquirer"),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingExitsRelations = relations(listingExits, ({ one }) => ({
  listing: one(listings, {
    fields: [listingExits.listingId],
    references: [listings.id],
  }),
}));

export const listingPartners = pgTable("listing_partner", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  partnerName: text("partner_name").notNull(),
  partnerListingId: text("partner_listing_id").references(() => listings.id),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingPartnersRelations = relations(
  listingPartners,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingPartners.listingId],
      references: [listings.id],
      relationName: "listingPartners",
    }),
  })
);

export const listingScreenshots = pgTable("listing_screenshot", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingScreenshotsRelations = relations(
  listingScreenshots,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingScreenshots.listingId],
      references: [listings.id],
    }),
  })
);

export const listingDatacenterLinks = pgTable("listing_datacenter_link", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  datacenterListingId: text("datacenter_listing_id").references(
    () => listings.id
  ),
  datacenterName: text("datacenter_name").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingDatacenterLinksRelations = relations(
  listingDatacenterLinks,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingDatacenterLinks.listingId],
      references: [listings.id],
      relationName: "listingDatacenterLinks",
    }),
  })
);

export const listingNews = pgTable("listing_news", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url"),
  source: text("source"),
  date: text("date"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingNewsRelations = relations(listingNews, ({ one }) => ({
  listing: one(listings, {
    fields: [listingNews.listingId],
    references: [listings.id],
  }),
}));

export const listingExternalLinks = pgTable("listing_external_link", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingExternalLinksRelations = relations(
  listingExternalLinks,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingExternalLinks.listingId],
      references: [listings.id],
    }),
  })
);

export const listingSources = pgTable("listing_source", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  title: text("title"),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingSourcesRelations = relations(
  listingSources,
  ({ one }) => ({
    listing: one(listings, {
      fields: [listingSources.listingId],
      references: [listings.id],
    }),
  })
);

export const listingCoupons = pgTable("listing_coupon", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  discount: text("discount").notNull(),
  expiresAt: date("expires_at"),
  votesYes: integer("votes_yes").default(0).notNull(),
  votesNo: integer("votes_no").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const listingCouponsRelations = relations(
  listingCoupons,
  ({ one, many }) => ({
    listing: one(listings, {
      fields: [listingCoupons.listingId],
      references: [listings.id],
    }),
    votes: many(couponVotes),
  })
);

export const couponVotes = pgTable(
  "coupon_vote",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    couponId: text("coupon_id")
      .notNull()
      .references(() => listingCoupons.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id),
    voterIp: text("voter_ip"),
    vote: text("vote").notNull(), // "yes" | "no"
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("coupon_vote_user_idx").on(table.couponId, table.userId),
    uniqueIndex("coupon_vote_ip_idx").on(table.couponId, table.voterIp),
  ]
);

export const couponVotesRelations = relations(couponVotes, ({ one }) => ({
  coupon: one(listingCoupons, {
    fields: [couponVotes.couponId],
    references: [listingCoupons.id],
  }),
  user: one(users, {
    fields: [couponVotes.userId],
    references: [users.id],
  }),
}));

export const personDegrees = pgTable("person_degree", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  institution: text("institution").notNull(),
  subject: text("subject"),
  degreeType: text("degree_type"),
  graduationYear: text("graduation_year"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const personDegreesRelations = relations(personDegrees, ({ one }) => ({
  listing: one(listings, {
    fields: [personDegrees.listingId],
    references: [listings.id],
  }),
}));

// ── Revisions ──────────────────────────────────────────────

export const revisions = pgTable(
  "revision",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id),
    userIp: text("user_ip"),
    action: text("action").notNull(), // 'create' | 'update' | 'delete'
    entityType: text("entity_type").notNull(), // 'listing' | 'office' | 'product' | etc.
    entityId: text("entity_id"),
    before: jsonb("before"),
    after: jsonb("after"),
    approvalStatus: approvalStatusEnum("approval_status")
      .default("approved")
      .notNull(),
    moderatedById: text("moderated_by_id").references(() => users.id),
    moderatedAt: timestamp("moderated_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("revision_listing_idx").on(table.listingId),
    index("revision_created_at_idx").on(table.createdAt),
    index("revision_approval_status_idx").on(table.approvalStatus),
  ]
);

export const revisionsRelations = relations(revisions, ({ one }) => ({
  listing: one(listings, {
    fields: [revisions.listingId],
    references: [listings.id],
  }),
  user: one(users, {
    fields: [revisions.userId],
    references: [users.id],
    relationName: "revisionAuthor",
  }),
  moderatedBy: one(users, {
    fields: [revisions.moderatedById],
    references: [users.id],
    relationName: "revisionModerator",
  }),
}));
