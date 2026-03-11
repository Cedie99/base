# BASE

A community-driven database for the web hosting industry, inspired by Crunchbase. Discover detailed profiles for web hosting companies, data centers, domain registrars, and industry professionals.

## Features

- **Four Categories** — Companies, Data Centers, Domain Registrars, and People
- **Modular Widget System** — Listing pages built from composable widgets (overview, offices, products, milestones, screenshots, and more)
- **Live Search** — Instant auto-complete search with Cmd+K shortcut
- **Pending Revision System** — User edits create pending revisions for moderator approval; listings stay live until approved
- **Revision History** — Full edit history with before/after diffs for every listing
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
│   ├── (public)/        # Public browse & listing pages
│   └── api/             # Auth & search API routes
├── components/
│   ├── dashboard/       # Dashboard UI & moderation
│   ├── home/            # Landing page sections
│   ├── public/          # Public header, footer, widgets
│   ├── search/          # Search bar & results
│   ├── submission/      # Listing submission forms
│   └── ui/              # shadcn primitives
├── hooks/               # Custom React hooks
├── lib/
│   ├── db/              # Drizzle schema & client
│   └── validations/     # Zod schemas
└── types/               # TypeScript type definitions
```

## License

This project is private.
