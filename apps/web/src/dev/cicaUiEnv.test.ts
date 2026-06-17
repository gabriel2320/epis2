import { describe, expect, it } from 'vitest';
import {
  CICA_UI_PRODUCT_STATUS,
  isCicaProductReady,
  isCicaUiEnabled,
} from './cicaUiEnv.js';

describe('cicaUiEnv', () => {
  it('CICA desactivado salvo VITE_ENABLE_CICA_UI=true explícito', () => {
    if (import.meta.env.VITE_ENABLE_CICA_UI === 'true') {
      expect(isCicaUiEnabled()).toBe(true);
    } else {
      expect(isCicaUiEnabled()).toBe(false);
    }
  });

  it('declara producto NO-GO hasta reformulación CICA-L', () => {
    expect(CICA_UI_PRODUCT_STATUS).toBe('no-go');
    expect(isCicaProductReady()).toBe(false);
  });
});
