import { describe, expect, it } from 'vitest';
import { MATERIAL_THEME_METADATA } from './theme-metadata.js';
import { clinicalBlueLightScheme, clinicalBlueDarkScheme } from './clinical-blue.js';
import { calmTealLightScheme, calmTealDarkScheme } from './calm-teal.js';
import { clinicalSemanticRoles } from '../clinical/clinical-semantic-roles.js';

const REQUIRED = [
  'primary',
  'onPrimary',
  'surface',
  'onSurface',
  'outline',
  'error',
  'inversePrimary',
] as const;

describe('generated Material Theme Builder schemes', () => {
  it('metadata lista temas aprobados', () => {
    const ids = MATERIAL_THEME_METADATA.map((m) => m.id);
    expect(ids).toContain('clinical-blue');
    expect(ids).toContain('calm-teal');
  });

  it.each([
    ['clinical-blue light', clinicalBlueLightScheme],
    ['clinical-blue dark', clinicalBlueDarkScheme],
    ['calm-teal light', calmTealLightScheme],
    ['calm-teal dark', calmTealDarkScheme],
  ])('%s contiene roles M3 mínimos', (_label, scheme) => {
    for (const role of REQUIRED) {
      expect(scheme[role]).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('roles clínicos protegidos no dependen del acento generado', () => {
    expect(clinicalSemanticRoles.critical.main).toBe('#B42318');
    expect(clinicalSemanticRoles.aiAssistance.main).toBe('#7455A6');
    expect(clinicalSemanticRoles.blocked.main).toBe(clinicalSemanticRoles.critical.main);
  });
});
