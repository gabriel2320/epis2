import type { Epis2Accent, M3SurfaceRoles } from './color-roles.js';

export type Epis2ThemeMode = 'light' | 'dark';

/** Tokens decorativos EPIS2 — no sustituyen roles clínicos ni palette semántica. */
export type Epis2VisualIdentity = {
  canvasGradient: string;
  heroRadial: string;
  cardElevation: string;
  cardBorder: string;
  focusRing: string;
  powerBarBg: string;
  powerBarBorder: string;
  powerBarFocusShadow: string;
  topBarBg: string;
  brandGradient: string;
};

export function buildVisualIdentity(
  mode: Epis2ThemeMode,
  _accent: Epis2Accent,
  surfaces?: M3SurfaceRoles,
): Epis2VisualIdentity {
  if (mode === 'light') {
    return {
      canvasGradient: surfaces?.surfaceContainer ?? '#F5F5F7',
      heroRadial: '',
      cardElevation: 'none',
      cardBorder: 'rgba(0, 0, 0, 0.06)',
      focusRing: 'rgba(24, 24, 27, 0.14)',
      powerBarBg: surfaces?.surfaceContainerHigh ?? '#EBEBED',
      powerBarBorder: 'rgba(0, 0, 0, 0.08)',
      powerBarFocusShadow: '0 0 0 2px rgba(24, 24, 27, 0.12)',
      topBarBg: 'transparent',
      brandGradient: 'none',
    };
  }

  return {
    canvasGradient: surfaces?.surfaceContainer ?? '#141416',
    heroRadial: '',
    cardElevation: 'none',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    focusRing: 'rgba(250, 250, 250, 0.16)',
    powerBarBg: surfaces?.surfaceContainerHigh ?? '#2C2C2E',
    powerBarBorder: 'rgba(255, 255, 255, 0.1)',
    powerBarFocusShadow: '0 0 0 2px rgba(250, 250, 250, 0.14)',
    topBarBg: 'transparent',
    brandGradient: 'none',
  };
}

/** Escala de sombras — plana; separación por tono, no elevación. */
export function buildEpis2Shadows(mode: Epis2ThemeMode): string[] {
  const shadows = Array.from({ length: 25 }, () => 'none');
  shadows[0] = 'none';
  if (mode === 'dark') {
    shadows[8] = '0 1px 3px rgba(0, 0, 0, 0.24)';
  }
  return shadows;
}
