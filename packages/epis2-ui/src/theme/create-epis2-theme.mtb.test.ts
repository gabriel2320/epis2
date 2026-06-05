import { describe, expect, it } from 'vitest';
import { clinicalBlueLightScheme } from './generated/clinical-blue.js';
import { calmTealLightScheme } from './generated/calm-teal.js';
import { clinicalRoles } from './clinical-roles.js';
import { createEpis2Theme } from './create-epis2-theme.js';

describe('createEpis2Theme — Material Theme Builder', () => {
  it('usa Clinical Blue MTB por defecto', () => {
    const theme = createEpis2Theme();
    expect(theme.epis2.themeId).toBe('clinical-blue');
    expect(theme.palette.primary?.main).toBe(clinicalBlueLightScheme.primary);
    expect(theme.palette.background?.default).toBe(clinicalBlueLightScheme.surfaceContainer);
    expect(theme.epis2.clinical).toEqual(clinicalRoles);
  });

  it('resuelve tealBlue a Calm Teal MTB', () => {
    const theme = createEpis2Theme({ accent: 'tealBlue' });
    expect(theme.epis2.themeId).toBe('calm-teal');
    expect(theme.palette.primary?.main).toBe(calmTealLightScheme.primary);
  });

  it('themeId explícito calm-teal ignora acento legacy', () => {
    const theme = createEpis2Theme({ themeId: 'calm-teal', accent: 'clinicalBlue' });
    expect(theme.epis2.themeId).toBe('calm-teal');
    expect(theme.palette.primary?.main).toBe(calmTealLightScheme.primary);
  });

  it('acentos sin MTB usan palette legacy', () => {
    const theme = createEpis2Theme({ accent: 'neutral' });
    expect(theme.epis2.themeId).toBe('legacy');
    expect(theme.palette.primary?.main).toBe('#27272A');
  });
});
