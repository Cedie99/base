# Mesh — Project Specification

> A user-generated database of information related to the web hosting industry.
> Inspired by [Crunchbase](https://www.crunchbase.com).

---

## Overview

Mesh is a community-driven database covering web hosting companies, data centers, domain name registrars, and industry professionals. Content is organized into **Categories → Listings → Widgets**, and all data can be submitted and edited by anyone — with role-based approval workflows.

---

## Core Concepts

### Categories

Top-level sections that organize database content:

| Category                   | Description                                 |
| -------------------------- | ------------------------------------------- |
| **Companies**              | Web hosting providers and related companies |
| **Data Centers**           | Data center profiles                        |
| **Domain Name Registrars** | Domain registrar profiles                   |
| **People**                 | Industry professionals                      |

**Future categories** (post-launch):

- **Events** — conferences, trade shows, conventions, workshops, social networking events
- **Software** — virtualization panels, helpdesk software, billing systems, popular scripts/OS

### Listings

A profile page within a category (e.g., a specific company). Each listing is composed of **Widgets**. When a user creates a brand-new listing, the submission form displays all applicable widgets on one page.

### Widgets

Modular information blocks within a listing (e.g., description, logo, address, tags, people, products, screenshots, etc.). Each widget contains one or more data fields. **When filled with content, widgets appear on the listing page. When not filled, they do not appear.**

### Users

| Role              | Permissions                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Administrator** | Submit content (no approval), manage all submissions, manage moderators & users, reset passwords, view revision history |
| **Moderator**     | Submit content (no approval), approve/reject/edit user submissions, view revision history, pin/lock discussion threads  |
| **User**          | Submit content (requires moderator/admin approval), view revision history, create discussions, post comments            |
| **Anonymous**     | Submit content (requires approval), IP address recorded, view revision history                                          |

> Deleting a user/moderator does **not** delete their contributed content.

---

## Home Page

- **Search bar** — cross-search by Name and URL simultaneously; live auto-complete results grouped by category
- **Category navigation** — each category shows total listing count (e.g., "Companies (1,318)"); links to full alphabetical/recently-updated listing pages
- **Recently added/edited** — chronological feed, newest first
- **Quick-add links** — Add Company, Add Data Center, Add Domain Registrar, Add Person
- **Data-driven insights** — e.g., product-type links (Linux Hosting, VPS Hosting, etc.) that filter companies

---

## URL Structure (SEO-friendly)

```
/company/hostgator
/person/artashes-toumanov
/companies/new
/datacenters/new
/registrars/new
/people/new
/company/hostgator/edit
/company/hostgator/revisions
/compare?items=company:hostgator,company:bluehost
/discussions
/discussions/new
/discussions/{id}
/graph
/api-docs
/api/v1/listings
/api/v1/listings/:category/:slug
/api/v1/categories
/api/v1/search?q=query
/api/v1/graph
/api/v1/embed/:category/:slug
/api/v1/oembed?url=
```

---

## Listing Page Layout

### Companies & Domain Registrars

**Left sidebar:** Logo, General Information, Offices, People, Data Centers, Products, Control Panels, _Service Providers (deferred)_
**Body:** Description, Hosting Info, Screenshots, Milestones, Coupons, IP Ranges, Discussions, Sources

Additional per-listing actions:

- Edit this page → `/company/{slug}/edit`
- Revision History → `/company/{slug}/revisions`
- Add to Compare (up to 3 listings)
- Subscribe to RSS feed for listing edits (only admin-approved edits)
- Widget embed code (compact "business card" for embedding on external sites)

### Data Centers

**Left sidebar:** Logo, General Information, Offices, Data Center Locations, People, Products, Control Panels
**Body:** Description, Hosting Info, Screenshots, Milestones, IP Ranges, Network Architecture, Discussions, Sources

### People

**Left sidebar:** Photo, General Information, Degrees, Companies, Interests
**Body:** Description, Milestones, Discussions, Sources

---

## Widgets by Category

### Company

| Widget                                   | Status         |
| ---------------------------------------- | -------------- |
| Company Name                             | ✅ Implemented |
| Logo                                     | ✅ Implemented |
| General Information                      | ✅ Implemented |
| Company Overview                         | ✅ Implemented |
| Milestones                               | ✅ Implemented |
| Videos                                   | ✅ Implemented |
| Tags                                     | ✅ Implemented |
| Offices                                  | ✅ Implemented |
| People                                   | ✅ Implemented |
| Products                                 | ✅ Implemented |
| Funding                                  | ✅ Implemented |
| Acquisitions                             | ✅ Implemented |
| Exit                                     | ✅ Implemented |
| Partners                                 | ✅ Implemented |
| Screenshots                              | ✅ Implemented |
| Datacenter(s)                            | ✅ Implemented |
| Recent News                              | ✅ Implemented |
| Coupons                                  | ✅ Implemented |
| External Links                           | ✅ Implemented |
| Sources                                  | ✅ Implemented |
| Control Panels                           | ✅ Implemented |
| Hosting Info (ASN, Uptime, Green Energy) | ✅ Implemented |
| IP Ranges                                | ✅ Implemented |
| _Service Providers_                      | 🔮 Deferred    |

### Data Center

| Widget                                   | Status                                                                |
| ---------------------------------------- | --------------------------------------------------------------------- |
| Company Name                             | ✅ Implemented                                                        |
| Logo                                     | ✅ Implemented                                                        |
| General Information                      | ✅ Implemented                                                        |
| Company Overview                         | ✅ Implemented                                                        |
| Milestones                               | ✅ Implemented                                                        |
| Videos                                   | ✅ Implemented                                                        |
| Tags                                     | ✅ Implemented                                                        |
| Offices                                  | ✅ Implemented                                                        |
| Data Center Locations                    | ⬜ Planned — separate from Offices, full address for each DC location |
| People                                   | ✅ Implemented                                                        |
| Products                                 | ✅ Implemented                                                        |
| Funding                                  | ✅ Implemented                                                        |
| Acquisitions                             | ✅ Implemented                                                        |
| Exit                                     | ✅ Implemented                                                        |
| Partners                                 | ✅ Implemented                                                        |
| Screenshots                              | ✅ Implemented                                                        |
| Network Architecture                     | ⬜ Planned — text + images describing network map                     |
| Recent News                              | ✅ Implemented                                                        |
| External Links                           | ✅ Implemented                                                        |
| Sources                                  | ✅ Implemented                                                        |
| Control Panels                           | ✅ Implemented                                                        |
| Hosting Info (ASN, Uptime, Green Energy) | ✅ Implemented                                                        |
| IP Ranges                                | ✅ Implemented                                                        |

### Domain Name Registrar

| Widget                                   | Status         |
| ---------------------------------------- | -------------- |
| Company Name                             | ✅ Implemented |
| Logo                                     | ✅ Implemented |
| General Information                      | ✅ Implemented |
| Company Overview                         | ✅ Implemented |
| Milestones                               | ✅ Implemented |
| Videos                                   | ✅ Implemented |
| Tags                                     | ✅ Implemented |
| Offices                                  | ✅ Implemented |
| People                                   | ✅ Implemented |
| Products                                 | ✅ Implemented |
| Funding                                  | ✅ Implemented |
| Acquisitions                             | ✅ Implemented |
| Exit                                     | ✅ Implemented |
| Partners                                 | ✅ Implemented |
| Screenshots                              | ✅ Implemented |
| Recent News                              | ✅ Implemented |
| Coupons                                  | ✅ Implemented |
| External Links                           | ✅ Implemented |
| Sources                                  | ✅ Implemented |
| Control Panels                           | ✅ Implemented |
| Hosting Info (ASN, Uptime, Green Energy) | ✅ Implemented |
| IP Ranges                                | ✅ Implemented |
| _Service Providers_                      | 🔮 Deferred    |

### People

| Widget                                               | Status                                  |
| ---------------------------------------------------- | --------------------------------------- |
| Name (First + Last)                                  | ✅ Implemented                          |
| Overview                                             | ✅ Implemented                          |
| Photo                                                | ✅ Implemented                          |
| General Information (social links, birthplace, etc.) | ✅ Implemented                          |
| Degrees                                              | ✅ Implemented                          |
| Companies (associated with title, start/end date)    | ⬜ Planned                              |
| Interests (keyword tags)                             | ⬜ Planned — currently uses Tags widget |
| Milestones                                           | ✅ Implemented                          |
| External Links                                       | ✅ Implemented                          |
| Sources                                              | ✅ Implemented                          |

---

## Widget Field Definitions

### Company Name

The title of the listing page.

### Logo

- Graphic uploaded, automatically resized/scaled to 250px width
- If source file < 250px width, not modified; height fluctuates
- Max file size enforced

### General Information

**Companies:**

- Company name (legal)
- Website URL
- Blog URL
- Blog Feed URL
- Twitter Username
- Phone
- Email
- Number of Employees
- Founding Date
- Status: `Active` | `Closed` | `Acquired`
- Class: `Privately Held` | `Publicly Traded` | `Government Owned` | `Non-for-profit`
  - If "Publicly Traded" selected → show stock ticker input field
- Servers under management
- Number of websites hosted
- Number of domains hosted
- Accepted methods of payment (checkboxes): Visa, MasterCard, American Express, PayPal, Google Checkout, Moneybookers, e-gold, eCheck, Regular Bank Cheque, Money Order, Direct Deposit, Western Union, MoneyGram, NETELLER, Yandex Money, Cash, Other (free text, comma-separated)

**Domain Registrars:**
Same as Companies, except:

- Replace server/hosting counts with **Total Domains**
- Same payment methods

**Data Centers:**
Same as Companies, except:

- **Number of Data Centers** (numeric input)
- **Total Square Footage**
- No server/hosting-specific counts

**People:**

- First Name, Last Name
- Birthplace (city, country)
- Birthdate (dropdown)
- Phone (support multiple: Phone 1, Phone 2 with labels like Work, Cell)
- Email
- Homepage URL
- Blog URL
- Blog Feed URL
- Twitter Username
- LinkedIn Profile
- Facebook Page
- Instagram
- TikTok
- YouTube channel
- MySpace Page

> **Current implementation note:** Status and Class are merged into one `companyStatus` enum: `privately_held`, `publicly_held`, `acquired`, `out_of_business`. Payment methods and some category-specific fields (Blog Feed URL, Total Square Footage, stock ticker, YouTube/MySpace) are not yet in the schema.

### Company Overview

Free-text neutral description of the company/entity.

### Offices

- Name of the office / label
- Address line 1
- Address line 2
- City
- State/Province (pre-determined values for USA and Canada)
- Postal code
- Country (most common English-speaking countries at top)
- HQ tag (optional)

### Data Center Locations (Data Centers only)

Same fields as Offices — separate widget for physical DC location addresses. Distinct from corporate offices.

> **Not yet implemented.** Currently data centers reuse the Offices widget.

### People (widget within Company/DC/Registrar)

- Name (with auto-complete to prevent duplicates)
- If name not in database, option to create new Person listing
- "Past" checkbox to identify people no longer with the entity
- Title
- Start date
- End date

### Companies (widget within People)

- Company name (with auto-complete)
- If name not in database, option to create new Company listing
- "Past" checkbox for previous employment
- Title
- Start date
- End date

> **Not yet implemented** as a separate widget. People listings currently lack company associations.

### Products

Category-specific predefined product lists:

**Company products:**
Free Web Hosting, Shared Hosting, Reseller Hosting, Dedicated Hosting, Colocation Hosting, VPS Hosting, Cloud Hosting, E-Commerce Hosting, Domain Name Registration, Domain Name Parking, SSL Certificates, Server Management, E-Mail Hosting, Exchange Hosting, Linux Hosting, Windows Hosting, Backup Service, Custom Development, Script Installation, Search Engine Optimization, Marketing Services, Graphic Design Services, Business Consulting Service, Merchant Gateway, Webmaster Tools, Affiliate Program

**Registrar products:**
Domain Name Registration, Domain Name Parking, Domain Name Search, Private Whois, Reseller Program, DNS Hosting, Web Hosting, E-Mail Hosting, Domain Name Marketplace, Domain Name Auction, SSL Certificates, Site Builder, Affiliate Program, Custom Development, Search Engine Optimization, Marketing Services, Graphic Design Services, Business Consulting Service, Merchant Gateway, Webmaster Tools

**Data Center products:**
Colocation, Dedicated Hosting, Cloud Hosting, Managed Hosting, Disaster Recovery, Interconnection, Remote Hands, Server Housing

All categories support an "Other" option where users can type custom product names (comma-separated). Custom products appear only after admin approval.

Products appear on listings as tag-format hyperlinks (clickable/searchable).

> **Implementation note:** Category-specific product lists are implemented via `PRODUCTS_BY_CATEGORY` in `src/types/listings.ts`. Each category (company, registrar, datacenter) has its own predefined product list. `PREDEFINED_PRODUCTS` is kept for backward compatibility as a combined unique list.

### Screenshots

- Website screenshots, user panel, product images
- Auto-resized to fit body width
- Limit: 2 screenshots per listing
- Max file size enforced

### Datacenter(s) (Company/Registrar widget)

- Names of associated data centers
- Auto-complete to prevent duplicates (URL shown below name for disambiguation)
- Links to Data Center listings
- If name not in database, option to create new DC listing

### Milestones

Repeatable entries with:

- Description
- Date
- Source Title
- Source URL
- "Add" button to create new, "Remove" link to delete

### Network Architecture (Data Centers only)

Text + images that define network architecture / map of service. Combines description and screenshot functionality in one module.

> **Not yet implemented.**

### Coupons (Companies & Domain Registrars)

**V1.0 (current target):**

- **Code** — coupon code
- **Discount description** — what the coupon offers
- **Expiration date** — optional
- **Date of submission** — auto-recorded
- Display: newest coupons first, auto-deleted on expiration date
- "Report coupon as non-working" flag → Admin review in "Reported Coupons" section
- Reports tracked by IP/userID to prevent duplicate reports

**V2.0 (future):**

- **Success rate** — community voting (Yes/No: "did this coupon work?")
- Display in two sections: Active coupons and Unreliable coupons
- Sorted by success percentage descending

> **Current implementation:** Has `code`, `discount`, `expiresAt`, `votesYes`, `votesNo` fields (V2.0 schema).

### Control Panels (Companies, Data Centers & Registrars)

- Name of control panel (e.g., cPanel, Plesk, DirectAdmin)
- Version (optional)
- Is Default (boolean) — marks the primary/default panel

> **Implemented.** Database table: `listingControlPanels`. Displayed on listing pages with version info and default indicator.

### Hosting Info (Companies, Data Centers & Registrars)

- ASN (Autonomous System Number)
- Uptime Guarantee (percentage)
- Green Energy Certified (boolean)
- Green Energy Details (text, shown when certified)

> **Implemented.** Fields stored on the listing record. Displayed as a grid on listing pages.

### IP Ranges (Companies, Data Centers & Registrars)

- Type: IPv4 or IPv6
- CIDR notation (e.g., `192.168.0.0/24`)
- Description (optional)

> **Implemented.** Database table: `listingIpRanges`. Supports both IPv4 and IPv6 ranges.

### Degrees (People only)

- Institution
- Subject(s)
- Degree Type
- Graduation Year

### Interests (People only)

Keywords that define social interests, comma-separated.

> **Not yet implemented** as distinct widget. Currently uses the Tags widget.

### External Links

Important links about the entity.

### Sources

Reference URLs where content was sourced (wiki-style citations). Always displayed at the bottom of the listing page.

### Recent News

Feed of news headlines relevant to the listing.

---

## Key Features

### Search

- Cross-search by Name and URL simultaneously
- Live auto-complete as user types (debounced 300ms)
- Results grouped by category with category icons/colors
- Keyboard shortcut: `Cmd+K` / `Ctrl+K` to focus search

### Duplicate Prevention

- Auto-complete on submission forms surfaces existing entries
- System warns user if a matching listing already exists
- Slug uniqueness enforced per category

### Revision History

- Every listing tracks last edit timestamp
- "Edit this page" link on each listing
- "Revision History" link shows all past edits with before/after diffs
- URL pattern: `/company/{slug}/revisions`
- Revision tracking captures: user ID, IP address, action type, before/after JSONB
- **Pending revision system:** user/anonymous edits create a revision with `approvalStatus="pending"` — the listing stays live and unchanged until a moderator approves the revision. Admin/moderator edits apply immediately with `approvalStatus="approved"`.
- Revisions table includes: `approvalStatus` (pending/approved/rejected), `moderatedById`, `moderatedAt`
- Moderators can approve (applies the `after` snapshot including widget changes) or reject (listing unchanged) pending revisions from the dashboard

### Submission Forms

- All widgets displayed on one page for new listing creation, including offices and products editors
- Category-specific: `/companies/new`, `/datacenters/new`, `/registrars/new`, `/people/new`
- Edit existing: `/company/{slug}/edit`, `/datacenter/{slug}/edit`, `/registrar/{slug}/edit`, `/person/{slug}/edit`
- Auto-slug generation from name
- Role-based approval: admin/moderator submissions auto-approved; user/anonymous submissions require approval
- **Edit flow:** user/anonymous edits create a pending revision (listing stays live); admin/moderator edits apply immediately with widget changes (offices, products)
- Widget editors: OfficesEditor (dynamic add/remove offices), ProductsEditor (category-specific checkbox grid), ListEditor (generic list widget editor) — hidden for `person` category where not applicable

### Listing Cards (Embeddable)

- Compact "business card" style embed for any listing
- Can be inserted into external pages (iframe or embed code)
- Available via `/api/v1/embed/:category/:slug`
- oEmbed support at `/api/v1/oembed?url=`

### Community Discussions

- Threaded discussions linked to specific listings or site-wide
- Nested comments with replies
- Moderator tools: pin threads, lock threads, delete threads/comments
- Discussion stats on user dashboard (threads created, comments posted, replies received)
- Listing pages show associated discussion threads
- Routes: `/discussions`, `/discussions/new`, `/discussions/{id}`
- Database tables: `discussionThreads`, `discussionComments`

### Listing Comparison

- Side-by-side comparison of up to 3 listings from the same category
- Compare button on listing cards and listing pages
- Persistent compare cart (localStorage-backed)
- Comparison table shows: key stats, sustainability, products, offices, funding, control panels
- URL-based: `/compare?items=category:slug,category:slug`

### Relationship Graph

- Interactive force-directed graph visualization
- Shows connections between companies, data centers, registrars, and people
- Node size reflects connection count
- Filterable by category, searchable by name
- Edge types: person links, datacenter links, partner links
- Color-coded by category (blue/green/amber/purple)
- Route: `/graph`

### Notification System

- Real-time notifications for user interactions
- Notification types: thread replies, comment replies, listing approved/rejected, revision approved/rejected, listing edited, listing discussion started
- Unread count badge on dashboard notification bell
- Mark as read (individual or all)
- Database table: `notifications`
- API endpoint: `GET /api/notifications`

### Public REST API (v1)

- Full read-only API for external access to the Mesh database
- No authentication required
- Rate limited: 60 requests per minute per IP
- CORS enabled (all origins)
- Standardized JSON response format with pagination metadata
- Endpoints:
  - `GET /api/v1/listings` — list approved listings (category/pagination filters)
  - `GET /api/v1/listings/:category/:slug` — single listing with all widgets
  - `GET /api/v1/categories` — category counts
  - `GET /api/v1/search?q=query` — search listings
  - `GET /api/v1/graph` — relationship graph data
  - `GET /api/v1/embed/:category/:slug` — embeddable HTML card
  - `GET /api/v1/oembed?url=` — oEmbed endpoint
- Interactive documentation at `/api-docs`

---

## Database Schema

### Core Tables

- `users` — user accounts with roles (admin, moderator, user)
- `listings` — all listing profiles across categories
- `revisions` — revision history with before/after JSONB and approval tracking

### Widget Tables

- `listingOffices` — office locations with HQ designation
- `listingProducts` — products/services offered
- `listingPeople` — associated people with title and dates
- `listingDatacenterLinks` — company ↔ datacenter associations
- `listingPartners` — partner relationships
- `listingFunding` — funding rounds
- `listingAcquisitions` — acquisitions
- `listingExits` — exit events
- `listingMilestones` — timeline milestones
- `listingScreenshots` — screenshot images
- `listingVideos` — video embeds
- `listingTags` — keyword tags
- `listingExternalLinks` — external URLs
- `listingSources` — reference sources
- `listingRecentNews` — news feed items
- `listingCoupons` — coupon codes with voting
- `listingDegrees` — degrees (people only)
- `listingControlPanels` — supported control panels with version info
- `listingIpRanges` — IPv4/IPv6 CIDR ranges

### Community Tables

- `discussionThreads` — discussion threads (title, body, pinned, locked, listing reference)
- `discussionComments` — comments with nested reply support
- `notifications` — user notification inbox

---

## Deferred Features

### Service Providers

Companies that provide services/products to the listed entity: marketing/advertising/SEO agency, domain registrar, data center, web design firm, technology partners (cPanel, SWsoft, etc), server management companies. Requires expanding the database with new categories (SEO companies, Web Design companies, etc.). Current priority: connect Companies, Data Centers, and Domain Registrars only.

### Scientific Data

External data feeds from sites like Quantcast, Compete, WebHosting.info, SEMRush. Potential partnership opportunity. Competitive intelligence data for visitors.

---

## Future Features (Post-Launch)

- Coupons V2.0 (success rate voting)
- Direct Contact (paid subscription)
- Jobs (paid subscription)
- Pro Access (database access)
- Direct Mailing (paid feature)
- Lightning Deals (24-hour front page ads, paid)
- Ratings
- Social Media feed results
- Listing view counts
- Honor Badges (auto-assigned milestones, e.g., high-traffic listing)
- Events category
- Software category
- RSS feeds per listing (admin-approved edits only)

---

## Removed Features

- **Competitors widget** — removed from all categories
- **API access** — moved from future to implemented (v1 now live)

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: NextAuth v5 (beta) with Credentials provider + JWT sessions
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-nova theme)
- **Validation**: Zod v4
- **State Management**: @tanstack/react-query
- **Notifications**: Sonner
- **Icons**: lucide-react
- **Theme**: next-themes (light/dark mode with dark default)
- **Font**: DM Sans (via next/font/google) + Geist Mono (monospace)
- **Smooth Scroll**: Lenis
