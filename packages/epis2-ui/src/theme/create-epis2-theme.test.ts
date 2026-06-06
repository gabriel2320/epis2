import { describe, expect, it } from 'vitest';
import { clinicalRoles } from './clinical-roles.js';
import { createEpis2Theme } from './create-epis2-theme.js';

describe('createEpis2Theme', () => {
  it('expone roles clínicos inmutables con cualquier acento', () => {
    const accents = ['clinicalBlue', 'tealBlue', 'calmGreen', 'soberViolet', 'neutral'] as const;
    for (const accent of accents) {
      const theme = createEpis2Theme({ accent });
      expect(theme.epis2.clinical).toEqual(clinicalRoles);
    }
  });

  it('incluye superficies M3, identidad visual y escala de forma', () => {
    const theme = createEpis2Theme();
    expect(theme.epis2.surfaces.surface).toBeTruthy();
    expect(theme.epis2.visual.brandGradient).toBe(theme.palette.primary?.main);
    expect(theme.epis2.visual.demoBadgeChip.borderColor).toBeTruthy();
    expect(theme.epis2.themeId).toBe('clinical-blue');
    expect(theme.palette.background?.default).toBe('#ECEEF5');
    expect(theme.epis2.shape.extraLarge).toBe(10);
    expect(theme.epis2.shape.island).toBe(8);
  });
});
