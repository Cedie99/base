# BASE

A community-driven database for the web hosting industry, inspired by Crunchbase. Discover detailed profiles for web hosting companies, data centers, domain registrars, and industry professionals.

## Features

- **Four Categories** — Companies, Data Centers, Domain Registrars, and People
- **Modular Widget System** — Listing pages built from composable widgets (overview, offices, products, milestones, screenshots, control panels, hosting info, IP ranges, and more)
- **Live Search** — Instant auto-complete search with Cmd+K shortcut
- **Pending Revision System** — User edits create pending revisions for moderator approval; listings stay live until approved
- **Revision History** — Full edit history with before/after diffs for every listing
- **Community Discussions** — Threaded discussions per listing or site-wide, with nested comments, pinning, and locking
- **Listing Comparison** — Side-by-side comparison of up to 3 listings from the same category
- **Relationship Graph** — Interactive force-directed graph showing connections between companies, data centers, registrars, and people
- **Public REST API** — Full API (v1) with rate limiting, search, oEmbed, and embeddable listing cards
- **Notifications** — Real-time notification system for thread replies, revision decisions, and listing approvals
- **Role-Based Access** — Administrator, Moderator, User, and Anonymous roles
- **No Account Required** — Anyone can submit new listings or suggest edits
- **Duplicate Prevention** — Automatic duplicate checking on submission
- **SEO-Friendly URLs** — Clean slugs like `/company/hostgator`
- **Dark Mode** — Dark by default with light mode support
- **Smooth Scroll** — Lenis smooth scrolling with scroll-triggered animations

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: NextAuth v5 (Credentials provider + JWT sessions)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Validation**: Zod v4
- **State**: @tanstack/react-query
- **Smooth Scroll**: Lenis
- **Notifications**: Sonner
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Cedie99/base.git
   cd base
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   DATABASE_URL=postgresql://...
   AUTH_SECRET=your-secret-key
   AUTH_URL=http://localhost:3000
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & register pages
│   ├── (dashboard)/     # Protected admin/moderator dashboard
│   ├── (public)/        # Public browse, listing, compare, discussions, graph pages
│   └── api/             # Auth, search, notifications, and public API v1
├── components/
│   ├── compare/         # Listing comparison (provider, button, bar, table)
│   ├── dashboard/       # Dashboard UI, moderation, notification bell
│   ├── discussions/     # Thread list, detail, comments, moderation actions
│   ├── graph/           # Force-directed relationship graph visualization
│   ├── home/            # Landing page sections
│   ├── public/          # Public header, footer, widgets (23 widget components)
│   ├── search/          # Search bar & results
│   ├── submission/      # Listing submission forms & widget editors
│   └── ui/              # shadcn primitives
├── lib/
│   ├── api/             # Public API v1 helpers (rate limiting, middleware, queries)
│   ├── db/              # Drizzle schema & client
│   └── validations/     # Zod schemas (listings, widgets, discussions)
└── types/               # TypeScript type definitions (listings, discussions, graph)
```

## API

BASE provides a public REST API at `/api/v1`. Rate limited to 60 requests per minute per IP.

| Endpoint | Description |
|---|---|
| `GET /api/v1/listings` | List approved listings (with category/pagination filters) |
| `GET /api/v1/listings/:category/:slug` | Get single listing with all widgets |
| `GET /api/v1/categories` | Get category counts |
| `GET /api/v1/search?q=query` | Search listings by name |
| `GET /api/v1/graph` | Relationship graph data (nodes + edges) |
| `GET /api/v1/embed/:category/:slug` | Embeddable HTML card |
| `GET /api/v1/oembed?url=` | oEmbed endpoint for rich previews |

Full documentation available at `/api-docs` when the app is running.

## License

This project is private.
