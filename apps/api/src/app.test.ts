import { describe, expect, it } from 'vitest';
import { buildApp } from './app.js';
import { testApiConfig } from './testConfig.js';

describe('epis2-api health', () => {
  it('GET /health responde ok', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { status: string; service: string };
    expect(body.status).toBe('ok');
    expect(body.service).toBe('epis2-api');
    await app.close();
  });

  it('GET /ready sin DATABASE_URL omite DB', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/ready' });
    expect(res.statusCode).toBe(200);
    await app.close();
  });

  it('GET /health/live responde ok (liveness estándar)', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/health/live' });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { status: string; service: string };
    expect(body.status).toBe('ok');
    expect(body.service).toBe('epis2-api');
    await app.close();
  });

  it('GET /health/ready responde con checks (readiness estándar)', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/health/ready' });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { checks: Record<string, string> };
    expect(body.checks).toHaveProperty('database');
    await app.close();
  });

  it('toda respuesta incluye x-correlation-id generado', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/health' });
    const correlationId = res.headers['x-correlation-id'];
    expect(typeof correlationId).toBe('string');
    expect(String(correlationId)).toMatch(/^[0-9a-f-]{36}$/);
    await app.close();
  });

  it('respeta x-correlation-id entrante (propagación)', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({
      method: 'GET',
      url: '/health',
      headers: { 'x-correlation-id': 'corr-demo-123' },
    });
    expect(res.headers['x-correlation-id']).toBe('corr-demo-123');
    await app.close();
  });
});

describe('OpenAPI docs (MF-NORM-301)', () => {
  it('GET /api/docs/openapi.json sirve spec OpenAPI 3.1', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/docs/openapi.json' });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { openapi: string; paths: Record<string, unknown> };
    expect(body.openapi).toMatch(/^3\.1/);
    expect(body.paths['/api/auth/login']).toBeDefined();
    expect(body.paths['/api/drafts']).toBeDefined();
    expect(body.paths['/api/patients']).toBeDefined();
    await app.close();
  });
});
