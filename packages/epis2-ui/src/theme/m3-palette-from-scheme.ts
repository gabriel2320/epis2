import type { PaletteOptions } from '@mui/material/styles';
import type { Epis2MaterialColorScheme } from './contracts/material-color-scheme.js';
import { epis2SemanticPalette, type M3SurfaceRoles } from './color-roles.js';

/** Extrae superficies M3 usadas por epis2.surfaces y layout. */
export function surfacesFromScheme(scheme: Epis2MaterialColorScheme): M3SurfaceRoles {
  return {
    surface: scheme.surface,
    surfaceContainer: scheme.surfaceContainer,
    surfaceContainerHigh: scheme.surfaceContainerHigh,
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
): PaletteOptions {
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
    warning: epis2SemanticPalette.warning,
    success: epis2SemanticPalette.success,
    info: epis2SemanticPalette.info,
  };
}
