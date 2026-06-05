import type { Epis2ApprovedThemeId, Epis2MaterialColorScheme } from './contracts/material-color-scheme.js';
import type { Epis2Accent } from './color-roles.js';
import {
  clinicalBlueDarkScheme,
  clinicalBlueLightScheme,
} from './generated/clinical-blue.js';
import { calmTealDarkScheme, calmTealLightScheme } from './generated/calm-teal.js';

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
};

/** Acentos legacy mapeados a temas MTB aprobados. */
export const ACCENT_TO_THEME_ID: Partial<Record<Epis2Accent, Epis2ApprovedThemeId>> = {
  clinicalBlue: 'clinical-blue',
  tealBlue: 'calm-teal',
};

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
