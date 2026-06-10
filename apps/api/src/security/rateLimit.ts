import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendApiError } from '../errors.js';

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

export function createRateLimitPreHandler(options: {
  keyPrefix: string;
  max: number;
  windowMs: number;
  skipInTest?: boolean;
  nodeEnv: string;
}) {
  const { keyPrefix, max, windowMs, skipInTest = true, nodeEnv } = options;
  return async function rateLimitPreHandler(request: FastifyRequest, reply: FastifyReply) {
    if (skipInTest && nodeEnv === 'test') return;
    const limit = checkRateLimit({
      key: `${keyPrefix}:${request.ip || 'unknown'}`,
      max,
      windowMs,
    });
    if (!limit.allowed) {
      reply.header('retry-after', String(limit.retryAfterSec ?? 0));
      return sendApiError(reply, 429, 'Demasiadas solicitudes. Intente más tarde.');
    }
  };
}
