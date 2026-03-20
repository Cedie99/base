import { withApiMiddleware } from "@/lib/api/middleware";
import { apiError } from "@/lib/api/response";
import { getPublicListingBySlug } from "@/lib/listings.queries";
import type { Category } from "@/types/listings";
import { CATEGORY_SINGULAR } from "@/types/listings";

const validCategories = ["company", "datacenter", "registrar", "person"];

export const GET = withApiMiddleware(async (
  request: Request,
  { params }: { params: Promise<{ category: string; slug: string }> }
) => {
  const { category, slug } = await params;

  if (!validCategories.includes(category)) {
    return apiError("INVALID_CATEGORY", "Invalid category", 400);
  }

  const listing = await getPublicListingBySlug(category as Category, slug);
  if (!listing) {
    return apiError("NOT_FOUND", "Listing not found", 404);
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const listingUrl = `${baseUrl}/${category}/${slug}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.card{border:1px solid #e5e5e5;border-radius:12px;padding:16px;max-width:400px;background:#fff;text-decoration:none;display:block;color:inherit;transition:border-color .2s}
.card:hover{border-color:#a3a3a3}
.header{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.logo{width:40px;height:40px;border-radius:8px;border:1px solid #e5e5e5;object-fit:contain;background:#fff;padding:2px}
.placeholder{width:40px;height:40px;border-radius:8px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:18px;color:#a3a3a3;font-weight:700}
.name{font-size:16px;font-weight:600;color:#171717}
.category{font-size:11px;color:#737373;text-transform:uppercase;letter-spacing:.5px}
.meta{display:flex;gap:16px;font-size:13px;color:#525252}
.meta span{display:flex;align-items:center;gap:4px}
.footer{margin-top:12px;padding-top:12px;border-top:1px solid #f5f5f5;font-size:11px;color:#a3a3a3;display:flex;justify-content:space-between}
</style></head>
<body>
<a class="card" href="${listingUrl}" target="_blank" rel="noopener">
  <div class="header">
    ${listing.logoUrl || listing.photoUrl
      ? `<img class="logo" src="${listing.logoUrl || listing.photoUrl}" alt="" />`
      : `<div class="placeholder">${listing.name.charAt(0)}</div>`
    }
    <div>
      <div class="name">${listing.name}</div>
      <div class="category">${CATEGORY_SINGULAR[category as Category]}</div>
    </div>
  </div>
  <div class="meta">
    ${listing.foundingDate ? `<span>Founded ${listing.foundingDate}</span>` : ""}
    ${listing.employees ? `<span>${listing.employees.toLocaleString()} employees</span>` : ""}
    ${listing.url ? `<span>${listing.url.replace(/^https?:\/\//, "")}</span>` : ""}
  </div>
  <div class="footer">
    <span>Powered by MESH</span>
    <span>View Profile &rarr;</span>
  </div>
</a>
</body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
