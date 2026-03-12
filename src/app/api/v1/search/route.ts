import { withApiMiddleware } from "@/lib/api/middleware";
import { apiSuccess, apiError } from "@/lib/api/response";
import { searchApiListings } from "@/lib/api/listings.queries";

export const GET = withApiMiddleware(async (request: Request) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(url.searchParams.get("perPage") || "20", 10)));

  if (!q || q.length < 2) {
    return apiError("INVALID_QUERY", "Search query must be at least 2 characters", 400);
  }

  const result = await searchApiListings(q, page, perPage);

  return apiSuccess(result.data, {
    total: result.total,
    page: result.page,
    perPage: result.perPage,
    totalPages: result.totalPages,
  });
});
