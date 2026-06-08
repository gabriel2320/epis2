import { describe, expect, it, vi } from 'vitest';
import { isDesignModeEnabled } from './designModeEnv.js';

describe('designModeEnv', () => {
  it('desactivado por defecto', () => {
    vi.stubEnv('VITE_ENABLE_DESIGN_MODE', undefined);
    expect(isDesignModeEnabled()).toBe(false);
  });

  it('respeta VITE_ENABLE_DESIGN_MODE=true', () => {
    vi.stubEnv('VITE_ENABLE_DESIGN_MODE', 'true');
    expect(isDesignModeEnabled()).toBe(true);
  });
});
