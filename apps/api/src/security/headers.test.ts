import { describe, expect, it } from 'vitest';
import { registerSecurityHeaders } from './headers.js';
import Fastify from 'fastify';

describe('registerSecurityHeaders', () => {
  it('añade headers HTTP mínimos', async () => {
    const app = Fastify();
    registerSecurityHeaders(app);
    app.get('/ping', async () => ({ ok: true }));

    const res = await app.inject({ method: 'GET', url: '/ping' });
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });
});
