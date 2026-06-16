import { describe, expect, it } from 'vitest';
import { resolveDemoCaseByPatientId } from './devFixturesBridge.js';

describe('devFixturesBridge (MF-CON-09)', () => {
  it('staging/production no cargan fixtures', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    await expect(resolveDemoCaseByPatientId('a0000001-0000-4000-8000-000000000001')).resolves.toBe(
      undefined,
    );
    process.env.NODE_ENV = prev;
  });

  it('development resuelve caso demo conocido', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const demoCase = await resolveDemoCaseByPatientId('a0000001-0000-4000-8000-000000000001');
    expect(demoCase?.demoCaseCode).toBe('DEMO-001');
    process.env.NODE_ENV = prev;
  });
});
