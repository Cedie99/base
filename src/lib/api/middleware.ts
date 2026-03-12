import { checkRateLimit } from "./rate-limit";
import { apiError } from "./response";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiHandler = (request: Request, ...args: any[]) => Promise<Response>;

export function withApiMiddleware<T extends ApiHandler>(handler: T): T {
  return (async (request: Request, ...args: unknown[]) => {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    const { allowed, remaining, resetAt } = checkRateLimit(ip);

    if (!allowed) {
      const res = apiError("RATE_LIMITED", "Too many requests. Try again later.", 429);
      res.headers.set("X-RateLimit-Limit", "60");
      res.headers.set("X-RateLimit-Remaining", "0");
      res.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
      res.headers.set("Retry-After", String(Math.ceil((resetAt - Date.now()) / 1000)));
      return res;
    }

    const response = await handler(request, ...args);

    response.headers.set("X-RateLimit-Limit", "60");
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  }) as T;
}
