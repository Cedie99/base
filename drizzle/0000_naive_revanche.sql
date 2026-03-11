CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('company', 'datacenter', 'registrar', 'person');--> statement-breakpoint
CREATE TYPE "public"."company_status" AS ENUM('privately_held', 'publicly_held', 'acquired', 'out_of_business');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'moderator', 'user');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "coupon_vote" (
	"id" text PRIMARY KEY NOT NULL,
	"coupon_id" text NOT NULL,
	"user_id" text,
	"voter_ip" text,
	"vote" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_acquisition" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"acquired_company" text NOT NULL,
	"date" text,
	"price" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_coupon" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"code" text NOT NULL,
	"discount" text NOT NULL,
	"expires_at" date,
	"votes_yes" integer DEFAULT 0 NOT NULL,
	"votes_no" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_datacenter_link" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"datacenter_listing_id" text,
	"datacenter_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_exit" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"exit_type" text NOT NULL,
	"date" text,
	"amount" text,
	"acquirer" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_external_link" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_funding" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"round_name" text,
	"amount" text,
	"date" text,
	"investors" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_milestone" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_news" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"source" text,
	"date" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_office" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"address" text NOT NULL,
	"city" text,
	"state" text,
	"country" text,
	"postal_code" text,
	"is_hq" boolean DEFAULT false NOT NULL,
	"label" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_partner" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"partner_name" text NOT NULL,
	"partner_listing_id" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_person" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"person_listing_id" text,
	"name" text NOT NULL,
	"title" text,
	"role" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_product" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_screenshot" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"image_url" text NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_source" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"title" text,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"tag" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_video" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing" (
	"id" text PRIMARY KEY NOT NULL,
	"category" "category" NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"approval_status" "approval_status" DEFAULT 'pending' NOT NULL,
	"legal_name" text,
	"url" text,
	"phone" text,
	"email" text,
	"employees" integer,
	"servers" integer,
	"domains_managed" integer,
	"clients" integer,
	"founding_date" text,
	"company_status" "company_status",
	"overview" text,
	"logo_url" text,
	"blog_feed_url" text,
	"number_of_datacenters" integer,
	"total_square_footage" text,
	"stock_ticker" text,
	"first_name" text,
	"last_name" text,
	"homepage_url" text,
	"blog_url" text,
	"twitter_username" text,
	"linkedin_url" text,
	"facebook_url" text,
	"instagram_url" text,
	"tiktok_url" text,
	"birthplace" text,
	"birthdate" date,
	"photo_url" text,
	"created_by_id" text,
	"created_by_ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person_degree" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"institution" text NOT NULL,
	"subject" text,
	"degree_type" text,
	"graduation_year" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revision" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"user_id" text,
	"user_ip" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before" jsonb,
	"after" jsonb,
	"approval_status" "approval_status" DEFAULT 'approved' NOT NULL,
	"moderated_by_id" text,
	"moderated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_vote" ADD CONSTRAINT "coupon_vote_coupon_id_listing_coupon_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."listing_coupon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_vote" ADD CONSTRAINT "coupon_vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_acquisition" ADD CONSTRAINT "listing_acquisition_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_coupon" ADD CONSTRAINT "listing_coupon_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_datacenter_link" ADD CONSTRAINT "listing_datacenter_link_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_datacenter_link" ADD CONSTRAINT "listing_datacenter_link_datacenter_listing_id_listing_id_fk" FOREIGN KEY ("datacenter_listing_id") REFERENCES "public"."listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_exit" ADD CONSTRAINT "listing_exit_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_external_link" ADD CONSTRAINT "listing_external_link_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_funding" ADD CONSTRAINT "listing_funding_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_milestone" ADD CONSTRAINT "listing_milestone_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_news" ADD CONSTRAINT "listing_news_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_office" ADD CONSTRAINT "listing_office_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_partner" ADD CONSTRAINT "listing_partner_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_partner" ADD CONSTRAINT "listing_partner_partner_listing_id_listing_id_fk" FOREIGN KEY ("partner_listing_id") REFERENCES "public"."listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_person" ADD CONSTRAINT "listing_person_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_person" ADD CONSTRAINT "listing_person_person_listing_id_listing_id_fk" FOREIGN KEY ("person_listing_id") REFERENCES "public"."listing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_product" ADD CONSTRAINT "listing_product_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_screenshot" ADD CONSTRAINT "listing_screenshot_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_source" ADD CONSTRAINT "listing_source_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_tag" ADD CONSTRAINT "listing_tag_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_video" ADD CONSTRAINT "listing_video_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_degree" ADD CONSTRAINT "person_degree_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision" ADD CONSTRAINT "revision_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision" ADD CONSTRAINT "revision_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision" ADD CONSTRAINT "revision_moderated_by_id_user_id_fk" FOREIGN KEY ("moderated_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_vote_user_idx" ON "coupon_vote" USING btree ("coupon_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_vote_ip_idx" ON "coupon_vote" USING btree ("coupon_id","voter_ip");--> statement-breakpoint
CREATE UNIQUE INDEX "listing_category_slug_idx" ON "listing" USING btree ("category","slug");--> statement-breakpoint
CREATE INDEX "listing_name_idx" ON "listing" USING btree ("name");--> statement-breakpoint
CREATE INDEX "listing_url_idx" ON "listing" USING btree ("url");--> statement-breakpoint
CREATE INDEX "listing_category_status_idx" ON "listing" USING btree ("category","approval_status");--> statement-breakpoint
CREATE INDEX "revision_listing_idx" ON "revision" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "revision_created_at_idx" ON "revision" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "revision_approval_status_idx" ON "revision" USING btree ("approval_status");