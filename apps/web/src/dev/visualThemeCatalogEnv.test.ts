import { describe, expect, it, vi } from 'vitest';
import { isVisualThemeCatalogEnabled } from './visualThemeCatalogEnv.js';

describe('isVisualThemeCatalogEnabled', () => {
  it('activo en dev por defecto', () => {
    vi.stubEnv('DEV', true);
    vi.stubEnv('VITE_ENABLE_VISUAL_THEME_CATALOG', undefined);
    expect(isVisualThemeCatalogEnabled()).toBe(true);
    vi.unstubAllEnvs();
  });

  it('respeta VITE_ENABLE_VISUAL_THEME_CATALOG=false', () => {
    vi.stubEnv('VITE_ENABLE_VISUAL_THEME_CATALOG', 'false');
    vi.stubEnv('DEV', true);
    expect(isVisualThemeCatalogEnabled()).toBe(false);
    vi.unstubAllEnvs();
  });
});
