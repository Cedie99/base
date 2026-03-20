import { withApiMiddleware } from "@/lib/api/middleware";
import { apiError } from "@/lib/api/response";
import { getPublicListingBySlug } from "@/lib/listings.queries";
import type { Category } from "@/types/listings";

export const GET = withApiMiddleware(async (request: Request) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url") || "";
  const baseUrl = `${url.protocol}//${url.host}`;

  // Parse /category/slug from URL
  const match = targetUrl.match(/\/(company|datacenter|registrar|person)\/([^/?#]+)/);
  if (!match) {
    return apiError("INVALID_URL", "Could not parse listing URL", 400);
  }

  const [, category, slug] = match;
  const listing = await getPublicListingBySlug(category as Category, slug);
  if (!listing) {
    return apiError("NOT_FOUND", "Listing not found", 404);
  }

  return Response.json({
    version: "1.0",
    type: "rich",
    provider_name: "Mesh",
    provider_url: baseUrl,
    title: listing.name,
    html: `<iframe src="${baseUrl}/api/v1/embed/${category}/${slug}" width="400" height="180" frameborder="0" style="border-radius:12px;border:1px solid #e5e5e5"></iframe>`,
    width: 400,
    height: 180,
    thumbnail_url: listing.logoUrl || listing.photoUrl || null,
  });
});
