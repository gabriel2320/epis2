import { describe, expect, it } from 'vitest';
import { clinicalBlueLightScheme } from './generated/clinical-blue.js';
import { calmTealLightScheme } from './generated/calm-teal.js';
import { clinicalCalmLightScheme } from './generated/clinical-calm.js';
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

  it('resuelve clinicalCalm a Clinical Calm MTB (8º perfil)', () => {
    const theme = createEpis2Theme({ accent: 'clinicalCalm' });
    expect(theme.epis2.themeId).toBe('clinical-calm');
    expect(theme.palette.primary?.main).toBe(clinicalCalmLightScheme.primary);
    expect(clinicalCalmLightScheme.primary).toBe('#0B5C66');
  });

  it('themeId explícito calm-teal ignora acento legacy', () => {
    const theme = createEpis2Theme({ themeId: 'calm-teal', accent: 'clinicalBlue' });
    expect(theme.epis2.themeId).toBe('calm-teal');
    expect(theme.palette.primary?.main).toBe(calmTealLightScheme.primary);
  });

  it('resuelve sageClinical a Sage Clinical MTB', () => {
    const theme = createEpis2Theme({ accent: 'sageClinical' });
    expect(theme.epis2.themeId).toBe('sage-clinical');
    expect(theme.palette.primary?.main).toBe('#28644A');
  });

  it('resuelve warmLinen a Warm Linen MTB', () => {
    const theme = createEpis2Theme({ accent: 'warmLinen' });
    expect(theme.epis2.themeId).toBe('warm-linen');
  });

  it('resuelve monochrome a Monochrome Gray MTB', () => {
    const theme = createEpis2Theme({ accent: 'monochrome' });
    expect(theme.epis2.themeId).toBe('monochrome-gray');
    expect(theme.palette.primary?.main).toBe('#171717');
    expect(theme.palette.warning?.main).toBe('#A3A3A3');
    expect(theme.epis2.visual.demoBadgeChip.borderColor).toBe('#A3A3A3');
  });

  it('acentos sin MTB usan palette legacy', () => {
    const theme = createEpis2Theme({ accent: 'neutral' });
    expect(theme.epis2.themeId).toBe('legacy');
    expect(theme.palette.primary?.main).toBe('#27272A');
  });
});
