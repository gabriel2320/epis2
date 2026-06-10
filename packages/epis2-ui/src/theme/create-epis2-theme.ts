import type { ClinicalRoleKey } from './clinical-roles.js';
import { clinicalRoles } from './clinical-roles.js';
import type { Epis2ApprovedThemeId } from './contracts/material-color-scheme.js';
import type { Epis2Accent, M3SurfaceRoles } from './color-roles.js';
import { buildM3PaletteOptions, darkSurfaces, lightSurfaces } from './color-roles.js';
import { buildEpis2Components } from './components.js';
import type { Epis2MotionScheme } from './motion.js';
import type { Epis2MaterialColorScheme } from './contracts/material-color-scheme.js';
import { getMaterialScheme, resolveMaterialThemeId } from './material-theme-registry.js';
import { paletteFromMaterialScheme, surfacesFromScheme } from './m3-palette-from-scheme.js';
import { epis2Shape, epis2ShapeBorderRadius } from './shape.js';
import { epis2StateLayerOpacity } from './motion.js';
import { hexWithAlpha } from './color-alpha.js';
import { epis2Typography, epis2TypographyRoles } from './typography.js';
import { resolveEpis2M3FormLayout, type Epis2M3FormLayout } from './m3-layout-tokens.js';
import {
  buildEpis2Shadows,
  buildVisualIdentity,
  type Epis2VisualIdentity,
} from './visual-identity.js';
import { createTheme, type Theme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

export type Epis2ThemeMode = 'light' | 'dark';
export type Epis2ThemeDensity = 'comfortable' | 'compact';
export type Epis2ThemeContrast = 'standard' | 'high';

export type CreateEpis2ThemeOptions = {
  mode?: Epis2ThemeMode;
  /** Tema MTB aprobado (THEME-02+). */
  themeId?: Epis2ApprovedThemeId;
  /** Acento legacy; clinicalBlue/tealBlue resuelven a MTB. */
  accent?: Epis2Accent;
  density?: Epis2ThemeDensity;
  contrast?: Epis2ThemeContrast;
  motion?: Epis2MotionScheme;
};

declare module '@mui/material/styles' {
  interface Theme {
    epis2: {
      themeId: Epis2ApprovedThemeId | 'legacy';
      accent: Epis2Accent;
      surfaces: M3SurfaceRoles;
      clinical: typeof clinicalRoles;
      shape: typeof epis2Shape;
      visual: Epis2VisualIdentity;
      formLayout: Epis2M3FormLayout;
    };
  }
  interface ThemeOptions {
    epis2?: Theme['epis2'];
  }
  interface Palette {
    /** Rol M3 tertiary (MTB); en path legacy cae al secondary del preset. */
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

function resolveLegacySurfaces(mode: Epis2ThemeMode): M3SurfaceRoles {
  return mode === 'light' ? lightSurfaces : darkSurfaces;
}

/**
 * Alto contraste ampliado (auditoría 3.6 / THEME-05): cada rol secundario sube un
 * nivel hacia `onSurface` — sin inventar colores fuera del esquema MTB aprobado.
 */
export function applyHighContrastRoles(surfaces: M3SurfaceRoles): M3SurfaceRoles {
  return {
    ...surfaces,
    onSurfaceVariant: surfaces.onSurface,
    outline: surfaces.onSurfaceVariant,
    outlineVariant: surfaces.outline,
  };
}

/** Único generador de tema EPIS2 (M3-G01). */
export function createEpis2Theme(options: CreateEpis2ThemeOptions = {}): Theme {
  const mode = options.mode ?? 'light';
  const accent = options.accent ?? 'clinicalBlue';
  const motion = options.motion ?? 'standard';
  const density = options.density ?? 'comfortable';
  const contrast = options.contrast ?? 'standard';
  const mappedThemeId = resolveMaterialThemeId(options.themeId, accent);

  let surfaces: M3SurfaceRoles;
  let palette;
  let epis2ThemeId: Epis2ApprovedThemeId | 'legacy';
  let activeScheme: Epis2MaterialColorScheme | undefined;

  if (mappedThemeId !== null) {
    epis2ThemeId = mappedThemeId;
    activeScheme = getMaterialScheme(mappedThemeId, mode);
    surfaces = surfacesFromScheme(activeScheme);
    palette = paletteFromMaterialScheme(mode, activeScheme, mappedThemeId);
  } else {
    epis2ThemeId = 'legacy';
    surfaces = resolveLegacySurfaces(mode);
    palette = buildM3PaletteOptions(mode, accent);
  }

  if (contrast === 'high') {
    surfaces = applyHighContrastRoles(surfaces);
    palette = {
      ...palette,
      text: { primary: surfaces.onSurface, secondary: surfaces.onSurfaceVariant },
      divider: surfaces.outlineVariant,
    };
  }

  // State layers M3 (states spec): feedback de interacción con el color del contenido,
  // no los defaults MUI (~4%). dragged (16%) no tiene clave MUI — usar epis2StateLayer().
  palette = {
    ...palette,
    action: {
      hover: hexWithAlpha(surfaces.onSurface, epis2StateLayerOpacity.hover),
      hoverOpacity: epis2StateLayerOpacity.hover,
      focus: hexWithAlpha(surfaces.onSurface, epis2StateLayerOpacity.focus),
      focusOpacity: epis2StateLayerOpacity.focus,
      selected: hexWithAlpha(surfaces.onSurface, epis2StateLayerOpacity.hover),
      selectedOpacity: epis2StateLayerOpacity.hover,
      activatedOpacity: epis2StateLayerOpacity.pressed,
    },
  };

  const visual = buildVisualIdentity(mode, activeScheme, surfaces);

  const typography =
    contrast === 'high'
      ? {
          ...epis2Typography,
          body1: { ...epis2TypographyRoles.bodyLarge, fontWeight: 500 },
          body2: { ...epis2TypographyRoles.bodyMedium, fontWeight: 500 },
        }
      : epis2Typography;

  return createTheme(
    {
      cssVariables: {
        cssVarPrefix: 'epis2',
      },
      palette,
      shadows: buildEpis2Shadows(mode) as Theme['shadows'],
      shape: { borderRadius: epis2ShapeBorderRadius },
      typography,
      spacing: density === 'compact' ? 7 : 8,
      components: buildEpis2Components(motion, contrast),
      epis2: {
        themeId: epis2ThemeId,
        accent,
        surfaces,
        clinical: clinicalRoles,
        shape: epis2Shape,
        visual,
        formLayout: resolveEpis2M3FormLayout(density),
      },
    },
    esES,
  );
}

export type { Epis2Accent, ClinicalRoleKey, Epis2VisualIdentity, Epis2ApprovedThemeId };
