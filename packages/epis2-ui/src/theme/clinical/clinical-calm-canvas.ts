import type { Epis2MaterialColorScheme } from '../contracts/material-color-scheme.js';

/** THEME-CALM-01 — canvas app (allowlist theme/clinical). */
export const epis2ClinicalCalmCanvasColors = {
  light: '#F7F9FC',
  dark: '#101418',
} as const;

/** Fondo `palette.background.default` para perfil clinical-calm. */
export function clinicalCalmCanvasBackground(
  mode: 'light' | 'dark',
  scheme: Epis2MaterialColorScheme,
): string {
  void scheme;
  return mode === 'light' ? epis2ClinicalCalmCanvasColors.light : epis2ClinicalCalmCanvasColors.dark;
}
