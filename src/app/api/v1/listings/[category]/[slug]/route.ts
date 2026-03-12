import { withApiMiddleware } from "@/lib/api/middleware";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getPublicListingBySlug } from "@/lib/listings.queries";
import type { Category } from "@/types/listings";

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

  const { createdById, createdByIp, ...data } = listing;
  return apiSuccess(data);
});
