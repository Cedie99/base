import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation — BASE",
  description: "Public REST API for accessing the BASE hosting industry database.",
};

function Endpoint({
  method,
  path,
  description,
  params,
  example,
}: {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
  example?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {method}
        </span>
        <code className="text-sm font-mono text-neutral-700 dark:text-neutral-200">{path}</code>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
      {params && params.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase text-neutral-400">Parameters</h4>
          <div className="space-y-1">
            {params.map((p) => (
              <div key={p.name} className="flex items-baseline gap-2 text-sm">
                <code className="font-mono text-xs text-neutral-600 dark:text-neutral-300">{p.name}</code>
                <span className="text-xs text-neutral-400">({p.type})</span>
                <span className="text-neutral-500">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {example && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold uppercase text-neutral-400">Example</h4>
          <pre className="overflow-x-auto rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-xs font-mono text-neutral-700 dark:text-neutral-200">
            {example}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">API Documentation</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Access the BASE hosting industry database via our public REST API. All endpoints return JSON and require no authentication.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Base URL</h2>
        <code className="block rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-sm font-mono text-neutral-700 dark:text-neutral-200">
          /api/v1
        </code>
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <p><strong>Rate Limiting:</strong> 60 requests per minute per IP address. Rate limit headers are included in all responses.</p>
          <p><strong>CORS:</strong> All origins are allowed. Responses include appropriate CORS headers.</p>
          <p><strong>Pagination:</strong> List endpoints support <code className="font-mono text-xs">page</code> and <code className="font-mono text-xs">perPage</code> (max 100) query parameters.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Endpoints</h2>

        <Endpoint
          method="GET"
          path="/api/v1/listings"
          description="List all approved listings with optional category filtering and pagination."
          params={[
            { name: "category", type: "string", description: "Filter by category: company, datacenter, registrar, person" },
            { name: "page", type: "number", description: "Page number (default: 1)" },
            { name: "perPage", type: "number", description: "Items per page (default: 20, max: 100)" },
          ]}
          example="GET /api/v1/listings?category=company&page=1&perPage=10"
        />

        <Endpoint
          method="GET"
          path="/api/v1/listings/:category/:slug"
          description="Get a single listing with all its widgets (products, offices, people, etc.)."
          example="GET /api/v1/listings/company/cloudflare"
        />

        <Endpoint
          method="GET"
          path="/api/v1/categories"
          description="Get all categories with their approved listing counts."
          example="GET /api/v1/categories"
        />

        <Endpoint
          method="GET"
          path="/api/v1/search"
          description="Search listings by name."
          params={[
            { name: "q", type: "string", description: "Search query (min 2 characters)" },
            { name: "page", type: "number", description: "Page number (default: 1)" },
            { name: "perPage", type: "number", description: "Items per page (default: 20, max: 100)" },
          ]}
          example="GET /api/v1/search?q=cloud&page=1"
        />

        <Endpoint
          method="GET"
          path="/api/v1/embed/:category/:slug"
          description="Returns a self-contained HTML card snippet for embedding on external websites."
          example={`<iframe src="/api/v1/embed/company/cloudflare" width="400" height="180" frameborder="0"></iframe>`}
        />

        <Endpoint
          method="GET"
          path="/api/v1/oembed"
          description="oEmbed endpoint for rich preview embedding. Pass a listing URL to get embed metadata."
          params={[
            { name: "url", type: "string", description: "Full listing URL, e.g. https://example.com/company/cloudflare" },
          ]}
          example="GET /api/v1/oembed?url=https://example.com/company/cloudflare"
        />

        <Endpoint
          method="GET"
          path="/api/v1/graph"
          description="Get the industry relationship graph data (nodes and edges)."
          params={[
            { name: "category", type: "string", description: "Optional category filter" },
          ]}
          example="GET /api/v1/graph?category=company"
        />
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Response Format</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">All responses follow a consistent JSON structure:</p>
        <pre className="overflow-x-auto rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 text-xs font-mono text-neutral-700 dark:text-neutral-200">
{`// Success
{
  "data": { ... },
  "meta": { "total": 42, "page": 1, "perPage": 20, "totalPages": 3 }
}

// Error
{
  "error": { "code": "NOT_FOUND", "message": "Listing not found" }
}`}
        </pre>
      </div>
    </div>
  );
}
