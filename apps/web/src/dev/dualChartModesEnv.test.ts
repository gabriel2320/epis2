import { afterEach, describe, expect, it, vi } from 'vitest';
import { isDualChartModesEnabled } from './dualChartModesEnv.js';

describe('isDualChartModesEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('está ON por default (ficha-first)', () => {
    vi.stubEnv('VITE_ENABLE_DUAL_CHART_MODES', undefined);
    expect(isDualChartModesEnabled()).toBe(true);
  });

  it('respeta opt-out explícito false', () => {
    vi.stubEnv('VITE_ENABLE_DUAL_CHART_MODES', 'false');
    expect(isDualChartModesEnabled()).toBe(false);
  });

  it('respeta opt-in explícito true', () => {
    vi.stubEnv('VITE_ENABLE_DUAL_CHART_MODES', 'true');
    expect(isDualChartModesEnabled()).toBe(true);
  });
});
