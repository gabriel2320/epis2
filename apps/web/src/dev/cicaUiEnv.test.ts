import { afterEach, describe, expect, it, vi } from 'vitest';
import { CICA_UI_PRODUCT_STATUS, isCicaProductReady, isCicaUiEnabled } from './cicaUiEnv.js';

describe('cicaUiEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('CICA activo con producto GO', () => {
    expect(CICA_UI_PRODUCT_STATUS).toBe('go');
    expect(isCicaProductReady()).toBe(true);
    expect(isCicaUiEnabled()).toBe(true);
  });

  it('respeta opt-out VITE_DISABLE_CICA_UI', () => {
    vi.stubEnv('VITE_DISABLE_CICA_UI', 'true');
    expect(isCicaUiEnabled()).toBe(false);
  });
});
