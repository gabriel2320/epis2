import type { Epis2MaterialColorScheme } from './contracts/material-color-scheme.js';
import type { M3SurfaceRoles } from './color-roles.js';
import { darkSurfaces, lightSurfaces } from './color-roles.js';
import { hexWithAlpha } from './color-alpha.js';

export type Epis2ThemeMode = 'light' | 'dark';

export type Epis2StatusChipColors = {
  borderColor: string;
  color: string;
  bgcolor: string;
};

/** Tokens decorativos EPIS2 — derivados del esquema MTB activo. */
export type Epis2VisualIdentity = {
  canvasGradient: string;
  heroRadial: string;
  cardElevation: string;
  cardBorder: string;
  focusRing: string;
  powerBarBg: string;
  powerBarBorder: string;
  powerBarFocusShadow: string;
  /** Sombra suave reservada al Command Dock flotante (única excepción tonal+shadow). */
  floatingDockShadow: string;
  topBarBg: string;
  brandGradient: string;
  demoBadgeChip: Epis2StatusChipColors;
};

function resolveSurfaces(
  mode: Epis2ThemeMode,
  scheme?: Epis2MaterialColorScheme,
  surfaces?: M3SurfaceRoles,
): M3SurfaceRoles {
  if (scheme) {
    return {
      surface: scheme.surface,
      surfaceContainerLowest: scheme.surfaceContainerLowest,
      surfaceContainerLow: scheme.surfaceContainerLow,
      surfaceContainer: scheme.surfaceContainer,
      surfaceContainerHigh: scheme.surfaceContainerHigh,
      surfaceContainerHighest: scheme.surfaceContainerHighest,
      onSurface: scheme.onSurface,
      onSurfaceVariant: scheme.onSurfaceVariant,
      outline: scheme.outline,
      outlineVariant: scheme.outlineVariant,
    };
  }
  return surfaces ?? (mode === 'light' ? lightSurfaces : darkSurfaces);
}

export function buildVisualIdentity(
  mode: Epis2ThemeMode,
  scheme?: Epis2MaterialColorScheme,
  surfaces?: M3SurfaceRoles,
): Epis2VisualIdentity {
  const resolved = resolveSurfaces(mode, scheme, surfaces);
  const focusBase = scheme?.primary ?? resolved.onSurface;
  const borderBase = scheme?.outline ?? resolved.outline;

  return {
    canvasGradient: resolved.surfaceContainer,
    heroRadial: '',
    cardElevation: 'none',
    cardBorder: hexWithAlpha(resolved.onSurface, mode === 'light' ? 0.08 : 0.12),
    focusRing: hexWithAlpha(resolved.onSurface, mode === 'light' ? 0.14 : 0.16),
    powerBarBg: resolved.surfaceContainerHigh,
    powerBarBorder: hexWithAlpha(borderBase, 0.45),
    powerBarFocusShadow: `0 0 0 2px ${hexWithAlpha(focusBase, 0.22)}`,
    floatingDockShadow:
      mode === 'light'
        ? `0 8px 32px ${hexWithAlpha(resolved.onSurface, 0.12)}, 0 2px 8px ${hexWithAlpha(resolved.onSurface, 0.06)}`
        : `0 12px 40px ${hexWithAlpha('#000000', 0.45)}, 0 2px 8px ${hexWithAlpha('#000000', 0.25)}`,
    topBarBg: resolved.surface,
    brandGradient: scheme ? scheme.primary : 'none',
    demoBadgeChip: {
      borderColor: borderBase,
      color: resolved.onSurfaceVariant,
      bgcolor: resolved.surfaceContainerHigh,
    },
  };
}

/** Escala de sombras — plana (THEME-06); separación solo por tono y borde. */
export function buildEpis2Shadows(_mode: Epis2ThemeMode): string[] {
  return Array.from({ length: 25 }, () => 'none');
}
