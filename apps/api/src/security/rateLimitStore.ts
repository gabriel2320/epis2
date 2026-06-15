import type { AppConfig } from '../config.js';
import { isDeployedEnv } from '../config.js';

export type RateLimitOptions = {
  key: string;
  max: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec?: number;
};

export interface RateLimitStore {
  checkLimit(options: RateLimitOptions): Promise<RateLimitResult>;
  resetForTests?(): void;
  close?(): Promise<void>;
}

export class MemoryRateLimitStore implements RateLimitStore {
  private buckets = new Map<string, { count: number; resetAt: number }>();

  async checkLimit({ key, max, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || now >= bucket.resetAt) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
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

  resetForTests(): void {
    this.buckets.clear();
  }
}

export function rateLimitBackendKind(config: AppConfig): 'memory' | 'redis' {
  return isDeployedEnv(config.NODE_ENV) ? 'redis' : 'memory';
}

export async function createRateLimitStore(config: AppConfig): Promise<RateLimitStore> {
  if (isDeployedEnv(config.NODE_ENV) && process.env.NODE_ENV !== 'test') {
    if (!config.REDIS_URL) {
      throw new Error('Fail-closed: staging/production requieren REDIS_URL para rate limit.');
    }
    const { RedisRateLimitStore } = await import('./rateLimitRedis.js');
    const store = new RedisRateLimitStore(config.REDIS_URL);
    await store.connect();
    return store;
  }
  return new MemoryRateLimitStore();
}
