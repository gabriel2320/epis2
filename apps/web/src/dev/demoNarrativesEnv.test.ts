import { describe, expect, it, vi } from 'vitest';
import { isDemoNarrativesEnabled } from './demoNarrativesEnv.js';

describe('isDemoNarrativesEnabled', () => {
  it('respeta flag explícito true', () => {
    vi.stubEnv('VITE_ENABLE_DEMO_NARRATIVES', 'true');
    expect(isDemoNarrativesEnabled()).toBe(true);
    vi.unstubAllEnvs();
  });

  it('respeta flag explícito false', () => {
    vi.stubEnv('VITE_ENABLE_DEMO_NARRATIVES', 'false');
    vi.stubEnv('DEV', 'false');
    expect(isDemoNarrativesEnabled()).toBe(false);
    vi.unstubAllEnvs();
  });
});
