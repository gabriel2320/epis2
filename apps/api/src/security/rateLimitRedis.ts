import { createClient, type RedisClientType } from 'redis';
import type { RateLimitOptions, RateLimitResult, RateLimitStore } from './rateLimitStore.js';

/** Fixed-window rate limit backed by Redis (MF-CON-07). */
export class RedisRateLimitStore implements RateLimitStore {
  private readonly client: RedisClientType;

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async close(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async checkLimit({ key, max, windowMs }: RateLimitOptions): Promise<RateLimitResult> {
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    const count = await this.client.incr(key);
    if (count === 1) {
      await this.client.expire(key, windowSec);
    }
    if (count > max) {
      const ttl = await this.client.ttl(key);
      return {
        allowed: false,
        retryAfterSec: Math.max(ttl, 1),
      };
    }
    return { allowed: true };
  }
}
