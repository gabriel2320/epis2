import type { PaletteColorOptions } from '@mui/material/styles';
import type { Epis2ApprovedThemeId } from './contracts/material-color-scheme.js';
import type { Epis2MaterialColorScheme } from './contracts/material-color-scheme.js';
import { epis2SemanticPalette } from './color-roles.js';

type SemanticPalette = {
  warning: PaletteColorOptions;
  success: PaletteColorOptions;
  info: PaletteColorOptions;
};

/** warning/success/info derivados del esquema activo (monocromo = grises). */
export function resolveEpis2SemanticPalette(
  themeId: Epis2ApprovedThemeId | 'legacy',
  scheme?: Epis2MaterialColorScheme,
): SemanticPalette {
  if (themeId !== 'monochrome-gray' || !scheme) {
    return {
      warning: epis2SemanticPalette.warning,
      success: epis2SemanticPalette.success,
      info: epis2SemanticPalette.info,
    };
  }

  return {
    warning: {
      main: scheme.outline,
      light: scheme.surfaceContainerHigh,
      dark: scheme.onSurface,
      contrastText: scheme.surface,
    },
    success: {
      main: scheme.primary,
      light: scheme.primaryContainer,
      dark: scheme.onPrimaryContainer,
      contrastText: scheme.onPrimary,
    },
    info: {
      main: scheme.secondary,
      light: scheme.secondaryContainer,
      dark: scheme.onSecondaryContainer,
      contrastText: scheme.onSecondary,
    },
  };
}
