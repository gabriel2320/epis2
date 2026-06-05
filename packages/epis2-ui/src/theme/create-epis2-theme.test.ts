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

  it('incluye superficies M3 y escala de forma', () => {
    const theme = createEpis2Theme();
    expect(theme.epis2.surfaces.surface).toBeTruthy();
    expect(theme.epis2.shape.extraLarge).toBe(24);
  });
});
