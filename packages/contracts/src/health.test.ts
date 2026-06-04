import { describe, expect, it } from 'vitest';
import { healthResponseSchema } from './health.js';

describe('healthResponseSchema', () => {
  it('acepta respuesta válida', () => {
    const parsed = healthResponseSchema.parse({
      status: 'ok',
      service: 'epis2-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      checks: { database: 'skipped' },
    });
    expect(parsed.status).toBe('ok');
  });

  it('rechaza status inválido', () => {
    expect(() =>
      healthResponseSchema.parse({
        status: 'unknown',
        service: 'x',
        version: '0',
        timestamp: new Date().toISOString(),
      }),
    ).toThrow();
  });
});
