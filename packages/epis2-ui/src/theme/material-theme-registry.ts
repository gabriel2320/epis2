import type {
  Epis2ApprovedThemeId,
  Epis2MaterialColorScheme,
} from './contracts/material-color-scheme.js';
import type { Epis2Accent } from './color-roles.js';
import {
  calmTealDarkScheme,
  calmTealLightScheme,
  clinicalCalmDarkScheme,
  clinicalCalmLightScheme,
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
} from './generated/index.js';

export const MATERIAL_THEME_SCHEMES: Record<
  Epis2ApprovedThemeId,
  { light: Epis2MaterialColorScheme; dark: Epis2MaterialColorScheme }
> = {
  'clinical-blue': {
    light: clinicalBlueLightScheme,
    dark: clinicalBlueDarkScheme,
  },
  'calm-teal': {
    light: calmTealLightScheme,
    dark: calmTealDarkScheme,
  },
  'clinical-calm': {
    light: clinicalCalmLightScheme,
    dark: clinicalCalmDarkScheme,
  },
  'slate-professional': {
    light: slateProfessionalLightScheme,
    dark: slateProfessionalDarkScheme,
  },
  'sage-clinical': {
    light: sageClinicalLightScheme,
    dark: sageClinicalDarkScheme,
  },
  'ocean-depth': {
    light: oceanDepthLightScheme,
    dark: oceanDepthDarkScheme,
  },
  'warm-linen': {
    light: warmLinenLightScheme,
    dark: warmLinenDarkScheme,
  },
  'monochrome-gray': {
    light: monochromeGrayLightScheme,
    dark: monochromeGrayDarkScheme,
  },
};

/** Acentos MTB aprobados — no alteran roles clínicos (M3-G02). */
export const ACCENT_TO_THEME_ID: Partial<Record<Epis2Accent, Epis2ApprovedThemeId>> = {
  clinicalBlue: 'clinical-blue',
  tealBlue: 'calm-teal',
  clinicalCalm: 'clinical-calm',
  slateProfessional: 'slate-professional',
  sageClinical: 'sage-clinical',
  oceanDepth: 'ocean-depth',
  warmLinen: 'warm-linen',
  monochrome: 'monochrome-gray',
};

export const MTB_ACCENT_IDS = Object.keys(ACCENT_TO_THEME_ID) as Epis2Accent[];

export const DEFAULT_THEME_ID: Epis2ApprovedThemeId = 'clinical-blue';

export function resolveMaterialThemeId(
  themeId?: Epis2ApprovedThemeId,
  accent?: Epis2Accent,
): Epis2ApprovedThemeId | null {
  if (themeId) return themeId;
  if (accent && ACCENT_TO_THEME_ID[accent]) return ACCENT_TO_THEME_ID[accent];
  return null;
}

export function getMaterialScheme(
  themeId: Epis2ApprovedThemeId,
  mode: 'light' | 'dark',
): Epis2MaterialColorScheme {
  return MATERIAL_THEME_SCHEMES[themeId][mode];
}
