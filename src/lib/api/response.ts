export interface ApiMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export function apiSuccess<T>(data: T, meta?: ApiMeta) {
  return Response.json({ data, ...(meta ? { meta } : {}) });
}

export function apiError(code: string, message: string, status: number) {
  return Response.json({ error: { code, message } }, { status });
}
