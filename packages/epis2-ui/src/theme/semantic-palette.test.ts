import { describe, expect, it } from 'vitest';
import { monochromeGrayLightScheme } from './generated/monochrome-gray.js';
import { createEpis2Theme } from './create-epis2-theme.js';
import { resolveEpis2SemanticPalette } from './semantic-palette.js';

describe('resolveEpis2SemanticPalette', () => {
  it('monochrome usa grises del esquema para warning/success/info', () => {
    const semantics = resolveEpis2SemanticPalette('monochrome-gray', monochromeGrayLightScheme);
    expect(semantics.warning?.main).toBe('#A3A3A3');
    expect(semantics.success?.main).toBe('#171717');
    expect(semantics.info?.main).toBe('#525252');
  });

  it('temas color usan semántica estándar', () => {
    const semantics = resolveEpis2SemanticPalette('clinical-blue');
    expect(semantics.warning?.main).toBe('#D97706');
  });
});

describe('createEpis2Theme visual identity', () => {
  it('demoBadgeChip deriva del esquema activo', () => {
    const theme = createEpis2Theme({ accent: 'monochrome', mode: 'light' });
    expect(theme.epis2.visual.demoBadgeChip.bgcolor).toBe('#ECECEC');
    expect(theme.epis2.visual.powerBarFocusShadow).toContain('rgba');
  });
});
