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
});
