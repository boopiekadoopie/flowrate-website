/*
 * Light abuse protection for the public API routes. This is best effort: the counter lives in the
 * memory of one server instance, so it slows down a single noisy client rather than guaranteeing a
 * global limit. A platform-level rate-limit rule (Cloudflare/Vercel) is the hard backstop.
 */

const ALLOWED_ORIGINS = new Set(["https://flowrate.agency", "https://www.flowrate.agency"]);

/* Browsers send Origin on every cross-origin and same-origin POST from fetch(). Requests without it
   (curl, scripts) or from another site are refused. Localhost is allowed outside production. */
export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

const buckets = new Map<string, number[]>();

/* Sliding window: true when this key has already made `limit` requests in the last `windowMs`. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  const limited = recent.length >= limit;
  if (!limited) recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return limited;
}
