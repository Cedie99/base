import { withApiMiddleware } from "@/lib/api/middleware";
import { apiSuccess } from "@/lib/api/response";
import { getCategoryCounts } from "@/lib/listings.queries";

export const GET = withApiMiddleware(async () => {
  const counts = await getCategoryCounts();
  return apiSuccess({
    categories: [
      { id: "company", label: "Companies", count: counts.company },
      { id: "datacenter", label: "Data Centers", count: counts.datacenter },
      { id: "registrar", label: "Domain Registrars", count: counts.registrar },
      { id: "person", label: "People", count: counts.person },
    ],
    total: Object.values(counts).reduce((a, b) => a + b, 0),
  });
});
