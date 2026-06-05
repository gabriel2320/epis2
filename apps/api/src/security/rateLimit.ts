type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  key: string;
  max: number;
  windowMs: number;
};

export function checkRateLimit({ key, max, windowMs }: RateLimitOptions): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= max) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function resetRateLimitsForTests() {
  buckets.clear();
}
