import { describe, expect, it } from 'vitest';
import { checkRateLimit, resetRateLimitsForTests } from './rateLimit.js';

describe('checkRateLimit', () => {
  it('bloquea tras superar el máximo en la ventana', async () => {
    resetRateLimitsForTests();
    const opts = { key: 'test-ip', max: 2, windowMs: 60_000 };
    expect((await checkRateLimit(opts)).allowed).toBe(true);
    expect((await checkRateLimit(opts)).allowed).toBe(true);
    const blocked = await checkRateLimit(opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });
});
