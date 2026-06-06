import { describe, expect, it } from 'vitest';
import { MATERIAL_THEME_METADATA } from './theme-metadata.js';
import {
  calmTealDarkScheme,
  calmTealLightScheme,
  clinicalBlueDarkScheme,
  clinicalBlueLightScheme,
  oceanDepthDarkScheme,
  oceanDepthLightScheme,
  sageClinicalDarkScheme,
  sageClinicalLightScheme,
  slateProfessionalDarkScheme,
  slateProfessionalLightScheme,
  warmLinenDarkScheme,
  warmLinenLightScheme,
  monochromeGrayDarkScheme,
  monochromeGrayLightScheme,
} from './index.js';
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

const ALL_SCHEMES: [string, (typeof clinicalBlueLightScheme)][] = [
  ['clinical-blue light', clinicalBlueLightScheme],
  ['clinical-blue dark', clinicalBlueDarkScheme],
  ['calm-teal light', calmTealLightScheme],
  ['calm-teal dark', calmTealDarkScheme],
  ['slate-professional light', slateProfessionalLightScheme],
  ['slate-professional dark', slateProfessionalDarkScheme],
  ['sage-clinical light', sageClinicalLightScheme],
  ['sage-clinical dark', sageClinicalDarkScheme],
  ['ocean-depth light', oceanDepthLightScheme],
  ['ocean-depth dark', oceanDepthDarkScheme],
  ['warm-linen light', warmLinenLightScheme],
  ['warm-linen dark', warmLinenDarkScheme],
  ['monochrome-gray light', monochromeGrayLightScheme],
  ['monochrome-gray dark', monochromeGrayDarkScheme],
];

describe('generated Material Theme Builder schemes', () => {
  it('metadata lista 7 perfiles MTB aprobados', () => {
    expect(MATERIAL_THEME_METADATA).toHaveLength(7);
    const ids = MATERIAL_THEME_METADATA.map((m) => m.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'clinical-blue',
        'calm-teal',
        'slate-professional',
        'sage-clinical',
        'ocean-depth',
        'warm-linen',
        'monochrome-gray',
      ]),
    );
  });

  it.each(ALL_SCHEMES)('%s contiene roles M3 mínimos', (_label, scheme) => {
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
