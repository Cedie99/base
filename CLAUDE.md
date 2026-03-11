# BASE — Project Context

> A user-generated database for the web hosting industry, inspired by Crunchbase.
> Full spec: `docs/PROJECT_SPEC.md`

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Database**: PostgreSQL via Drizzle ORM (`src/lib/db/schema.ts`)
- **Auth**: NextAuth v5 (beta) with Credentials provider + JWT sessions
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-nova style)
- **Theme**: next-themes (light/dark mode, dark default, class-based)
- **Font**: DM Sans (primary) + Geist Mono (monospace)
- **Validation**: Zod v4
- **State**: @tanstack/react-query
- **Notifications**: Sonner
- **Icons**: lucide-react

## Project Structure

```
src/
├── app/
│   ├── (auth)/                  # Login, register pages (grid bg + branded layout)
│   ├── (dashboard)/             # Protected dashboard routes
│   ├── (public)/                # Public listing/browse pages
│   │   ├── companies/           # Browse + /new submission
│   │   ├── datacenters/         # Browse + /new submission
│   │   ├── registrars/          # Browse + /new submission
│   │   ├── people/              # Browse + /new submission
│   │   ├── company/[slug]/      # Listing detail + /edit + /revisions
│   │   ├── person/[slug]/       # Listing detail + /edit + /revisions
│   │   ├── datacenter/[slug]/   # Listing detail + /edit + /revisions
│   │   ├── registrar/[slug]/    # Listing detail + /edit + /revisions
│   │   ├── search/              # Full search results page
│   │   └── layout.tsx           # Public chrome (header + footer)
│   ├── api/
│   │   ├── auth/                # NextAuth API route
│   │   └── search/              # Search API endpoint
│   ├── layout.tsx               # Root layout (DM Sans font, providers)
│   ├── page.tsx                 # Landing page (hero, categories, activity)
│   └── globals.css              # Tailwind theme + CSS variables + animations
├── components/
│   ├── auth/                    # LoginForm, RegisterForm
│   ├── dashboard/               # Header, Sidebar, UserNav, moderation/
│   │   └── moderation/          # ModerationQueue, ModerationTabs, PendingEditsQueue
│   ├── home/                    # Hero, CategoryCards, RecentActivity, QuickAdd, etc.
│   ├── public/                  # PublicHeader, PublicFooter, ListingLayout, widgets/
│   │   └── widgets/             # 20 widget display components (overview, offices, etc.)
│   ├── search/                  # SearchBar (with Cmd+K), SearchResultsDropdown
│   ├── submission/              # SubmissionForm, DuplicateCheck, OfficesEditor, ProductsEditor
│   ├── ui/                      # shadcn primitives (button, card, input, etc.)
│   └── providers.tsx            # SessionProvider, QueryClient, ThemeProvider, Toaster
├── lib/
│   ├── auth.ts                  # NextAuth config (credentials + DrizzleAdapter)
│   ├── auth.actions.ts          # Server actions: login(), register()
│   ├── auth.helpers.ts          # Session/role helpers
│   ├── submission.actions.ts    # Public submission: submitListing(), submitListingEdit() (pending revision system)
│   ├── listings.actions.ts      # Admin/mod: createListing(), updateListing(), deleteListing()
│   ├── listings.queries.ts      # getCategoryCounts(), getRecentListings(), etc.
│   ├── search.queries.ts        # searchListings() with grouped results
│   ├── moderation.actions.ts    # Approval/rejection: approveListing(), rejectListing(), approveRevision(), rejectRevision()
│   ├── moderation.queries.ts    # getPendingSubmissions(), getPendingRevisions()
│   ├── revisions.queries.ts     # Revision history queries
│   ├── revisions.ts             # createRevision() helper (supports approvalStatus param, returns revision)
│   ├── utils.ts                 # cn() helper
│   ├── utils/
│   │   └── category-colors.ts   # Category → Tailwind color class mapping
│   ├── validations/
│   │   ├── listing.ts           # Zod schemas for listing create/update
│   │   └── widgets.ts           # Zod schemas for all widget types
│   └── db/
│       ├── schema.ts            # Drizzle schema (users, listings, 17 widget tables, revisions w/ approval tracking)
│       └── index.ts             # DB client (postgres + drizzle, cached in dev)
├── types/
│   ├── listings.ts              # Listing, Widget types, Category constants, PRODUCTS_BY_CATEGORY, RevisionWithRelations
│   └── next-auth.d.ts           # Session type extensions
└── middleware.ts                 # Route protection (/dashboard, /login, /register)
```

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema directly to DB
npm run db:studio        # Open Drizzle Studio
```

## Conventions

- **Files**: kebab-case for components, camelCase for utilities
- **Components**: PascalCase, server components by default, `"use client"` only when needed
- **Server actions**: `"use server"`, return `{ error?: string; success?: boolean }`
- **Routes**: grouped with parentheses `(auth)`, `(dashboard)`, `(public)`
- **Database**: snake_case tables/columns, UUID primary keys, cascade deletes
- **Imports**: use `@/` path alias (maps to `src/`)
- **Styling**: utility-first Tailwind, CVA for component variants, `dark:` prefix for dark mode
- **Validation**: Zod schemas for all form/input data
- **No `any` types** — use explicit interfaces

## Environment Variables

```
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
```

## What We're Building

BASE is a community-driven database with 4 categories:
- **Companies** — web hosting providers
- **Data Centers** — data center profiles
- **Domain Registrars** — registrar profiles
- **People** — industry professionals

Each category has **Listings** (profile pages) composed of **Widgets** (modular info blocks). Widgets only appear when filled with content.

**Listing page layout:**
- Companies/Registrars: Sidebar (logo, info, offices, people, DCs, products) + Body (overview, screenshots, milestones, coupons, sources)
- Data Centers: Sidebar (logo, info, offices, DC locations, people) + Body (overview, screenshots, milestones, network architecture, sources)
- People: Sidebar (photo, info, degrees, companies, interests) + Body (overview, milestones, sources)

**Submission forms:** All widgets (including offices, products editors) on one page at `/companies/new`, `/datacenters/new`, `/registrars/new`, `/people/new`. Edit at `/company/{slug}/edit`, `/datacenter/{slug}/edit`, `/registrar/{slug}/edit`, `/person/{slug}/edit`.

**User roles**: Administrator (full access), Moderator (content approval), User (submit for approval), Anonymous (submit for approval, IP tracked).

**Key features**: live search with auto-complete (Cmd+K), SEO-friendly URLs (`/company/hostgator`), revision history with before/after diffs, duplicate prevention, embeddable listing cards, **pending revision system** (user edits create pending revisions for moderator approval; listing stays live until approved).

**Products are category-specific** (`PRODUCTS_BY_CATEGORY`):
- Companies: Shared Hosting, VPS, Dedicated, Colocation, Cloud, SSL, etc.
- Registrars: Domain Registration, Parking, Search, Private Whois, DNS Hosting, etc.
- Data Centers: Colocation, Dedicated Hosting, Cloud Hosting, Managed Hosting, etc.

**Deferred features**: Service Providers widget, Scientific Data feeds, payment methods checkboxes, Network Architecture widget, Data Center Locations widget (separate from Offices).

See `docs/PROJECT_SPEC.md` for full widget definitions, field specs, and feature details.
