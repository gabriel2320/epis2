import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendApiError } from '../errors.js';
import {
  MemoryRateLimitStore,
  type RateLimitOptions,
  type RateLimitResult,
  type RateLimitStore,
} from './rateLimitStore.js';

export type { RateLimitOptions, RateLimitResult };

let rateLimitStore: RateLimitStore = new MemoryRateLimitStore();

export function setRateLimitStore(store: RateLimitStore): void {
  rateLimitStore = store;
}

export function getRateLimitStore(): RateLimitStore {
  return rateLimitStore;
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  return rateLimitStore.checkLimit(options);
}

export function resetRateLimitsForTests(): void {
  rateLimitStore.resetForTests?.();
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
    const limit = await checkRateLimit({
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
