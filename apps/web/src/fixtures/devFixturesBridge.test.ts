import { describe, expect, it } from 'vitest';
import { getDemoCaseByPatientId, initDevFixtures } from './devFixturesBridge.js';

describe('web devFixturesBridge (RH-06)', () => {
  it('development resuelve caso demo tras init', async () => {
    await initDevFixtures();
    expect(getDemoCaseByPatientId('a0000001-0000-4000-8000-000000000001')?.demoCaseCode).toBe(
      'DEMO-001',
    );
  });
});
