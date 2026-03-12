import { withApiMiddleware } from "@/lib/api/middleware";
import { apiSuccess, apiError } from "@/lib/api/response";
import { getApiListings } from "@/lib/api/listings.queries";
import type { Category } from "@/types/listings";

const validCategories = ["company", "datacenter", "registrar", "person"];

export const GET = withApiMiddleware(async (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("perPage") || "20", 10)));

  if (category && !validCategories.includes(category)) {
    return apiError("INVALID_CATEGORY", `Invalid category. Must be one of: ${validCategories.join(", ")}`, 400);
  }

  const result = await getApiListings({
    category: category as Category | undefined,
    page,
    perPage,
  });

  return apiSuccess(result.data, {
    total: result.total,
    page: result.page,
    perPage: result.perPage,
    totalPages: result.totalPages,
  });
});
