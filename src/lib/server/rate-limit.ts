type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, limit, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    ok: existing.count <= limit,
    remaining,
    limit,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

/**
 * Derives the throttle key for a request.
 *
 * Forwarding headers are only believed when KOYO_TRUST_PROXY=1, i.e. when the
 * app genuinely sits behind a proxy or CDN that overwrites them. Otherwise any
 * caller could rotate X-Forwarded-For and bypass every rate limit.
 */
export function clientKey(request: Request, bucket: string) {
  const trustProxy = process.env.KOYO_TRUST_PROXY === '1';
  if (!trustProxy) return `${bucket}:local`;
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim() || 'local';
  return `${bucket}:${ip}`;
}

export function resetRateLimits() {
  buckets.clear();
}
