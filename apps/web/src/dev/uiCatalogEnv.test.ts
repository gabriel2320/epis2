import { describe, expect, it, vi } from 'vitest';
import { isUiCatalogEnabled } from './uiCatalogEnv.js';

describe('isUiCatalogEnabled', () => {
  it('respeta VITE_ENABLE_UI_CATALOG=true', () => {
    vi.stubEnv('VITE_ENABLE_UI_CATALOG', 'true');
    vi.stubEnv('DEV', false);
    vi.stubEnv('PROD', true);
    expect(isUiCatalogEnabled()).toBe(true);
    vi.unstubAllEnvs();
  });

  it('respeta VITE_ENABLE_UI_CATALOG=false en desarrollo', () => {
    vi.stubEnv('VITE_ENABLE_UI_CATALOG', 'false');
    vi.stubEnv('DEV', true);
    expect(isUiCatalogEnabled()).toBe(false);
    vi.unstubAllEnvs();
  });
});
