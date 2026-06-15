import { describe, expect, it } from 'vitest';
import { registerSecurityHeaders } from './headers.js';
import { testApiConfig } from '../testConfig.js';
import Fastify from 'fastify';
import {
  API_CONTENT_SECURITY_POLICY,
  buildCorsOptions,
  clearSessionCookieOptions,
  sessionCookieOptions,
} from './httpBaseline.js';

describe('registerSecurityHeaders', () => {
  it('añade headers HTTP mínimos incl. CSP', async () => {
    const app = Fastify();
    registerSecurityHeaders(app, testApiConfig);
    app.get('/ping', async () => ({ ok: true }));

    const res = await app.inject({ method: 'GET', url: '/ping' });
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['content-security-policy']).toBe(API_CONTENT_SECURITY_POLICY);
    expect(res.headers['strict-transport-security']).toBeUndefined();
    await app.close();
  });

  it('añade HSTS en staging', async () => {
    const app = Fastify();
    registerSecurityHeaders(app, {
      ...testApiConfig,
      NODE_ENV: 'staging',
      RLS_MODE: 'enforce',
    });
    app.get('/ping', async () => ({ ok: true }));

    const res = await app.inject({ method: 'GET', url: '/ping' });
    expect(res.headers['strict-transport-security']).toContain('max-age=');
    await app.close();
  });
});

describe('httpBaseline helpers', () => {
  it('sessionCookieOptions fail-closed en staging', () => {
    const opts = sessionCookieOptions({
      ...testApiConfig,
      NODE_ENV: 'staging',
      RLS_MODE: 'enforce',
    });
    expect(opts.httpOnly).toBe(true);
    expect(opts.secure).toBe(true);
    expect(opts.sameSite).toBe('lax');
  });

  it('buildCorsOptions restringe origin al WEB_ORIGIN', () => {
    const cors = buildCorsOptions(testApiConfig);
    expect(cors.origin).toBe(testApiConfig.WEB_ORIGIN);
    expect(cors.credentials).toBe(true);
    expect(cors.methods).toContain('POST');
    expect(cors.allowedHeaders).toContain('Content-Type');
  });

  it('clearSessionCookieOptions hereda secure en producción', () => {
    const opts = clearSessionCookieOptions({
      ...testApiConfig,
      NODE_ENV: 'production',
      RLS_MODE: 'enforce',
      AUTH_MODE: 'production',
    });
    expect(opts.secure).toBe(true);
    expect(opts.path).toBe('/');
  });
});
