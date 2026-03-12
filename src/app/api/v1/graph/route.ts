import { withApiMiddleware } from "@/lib/api/middleware";
import { apiSuccess } from "@/lib/api/response";
import { getGraphData } from "@/lib/api/graph.queries";
import type { Category } from "@/types/listings";

export const GET = withApiMiddleware(async (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") as Category | null;

  const data = await getGraphData(category || undefined);

  return apiSuccess(data, {
    total: data.nodes.length,
    page: 1,
    perPage: data.nodes.length,
    totalPages: 1,
  });
});
