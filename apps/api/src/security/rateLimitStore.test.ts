import { describe, expect, it } from 'vitest';
import {
  createRateLimitStore,
  MemoryRateLimitStore,
  rateLimitBackendKind,
} from './rateLimitStore.js';
import { testApiConfig } from '../testConfig.js';

describe('rateLimitStore', () => {
  it('usa memory en development', async () => {
    const store = await createRateLimitStore(testApiConfig);
    expect(store).toBeInstanceOf(MemoryRateLimitStore);
    expect(rateLimitBackendKind(testApiConfig)).toBe('memory');
  });

  it('memory store bloquea en ventana fija', async () => {
    const store = new MemoryRateLimitStore();
    const opts = { key: 'mem-key', max: 1, windowMs: 60_000 };
    expect((await store.checkLimit(opts)).allowed).toBe(true);
    expect((await store.checkLimit(opts)).allowed).toBe(false);
  });

  it('requiere REDIS_URL en staging (runtime)', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'staging';
    try {
      await expect(
        createRateLimitStore({
          ...testApiConfig,
          NODE_ENV: 'staging',
          RLS_MODE: 'enforce',
          AUTH_MODE: 'hybrid',
          SESSION_SECRET: 'staging-session-value-min-32-chars',
        }),
      ).rejects.toThrow(/REDIS_URL/);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
