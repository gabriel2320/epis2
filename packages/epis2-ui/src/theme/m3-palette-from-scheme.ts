import type { PaletteOptions } from '@mui/material/styles';
import type { Epis2ApprovedThemeId } from './contracts/material-color-scheme.js';
import type { Epis2MaterialColorScheme } from './contracts/material-color-scheme.js';
import { type M3SurfaceRoles } from './color-roles.js';
import { resolveEpis2SemanticPalette } from './semantic-palette.js';

/** Extrae superficies M3 usadas por epis2.surfaces y layout. */
export function surfacesFromScheme(scheme: Epis2MaterialColorScheme): M3SurfaceRoles {
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

/** Convierte esquema Material Theme Builder a palette MUI (roles clínicos aparte). */
export function paletteFromMaterialScheme(
  mode: 'light' | 'dark',
  scheme: Epis2MaterialColorScheme,
  themeId: Epis2ApprovedThemeId,
): PaletteOptions {
  const semantics = resolveEpis2SemanticPalette(themeId, scheme);

  return {
    mode,
    primary: {
      main: scheme.primary,
      light: scheme.primaryContainer,
      dark: scheme.onPrimaryContainer,
      contrastText: scheme.onPrimary,
    },
    secondary: {
      main: scheme.secondary,
      light: scheme.secondaryContainer,
      dark: scheme.onSecondaryContainer,
      contrastText: scheme.onSecondary,
    },
    tertiary: {
      main: scheme.tertiary,
      light: scheme.tertiaryContainer,
      dark: scheme.onTertiaryContainer,
      contrastText: scheme.onTertiary,
    },
    background: {
      default: scheme.surfaceContainer,
      paper: scheme.surface,
    },
    text: {
      primary: scheme.onSurface,
      secondary: scheme.onSurfaceVariant,
    },
    divider: scheme.outlineVariant,
    error: {
      main: scheme.error,
      light: scheme.errorContainer,
      dark: scheme.onErrorContainer,
      contrastText: scheme.onError,
    },
    warning: semantics.warning,
    success: semantics.success,
    info: semantics.info,
  };
}
