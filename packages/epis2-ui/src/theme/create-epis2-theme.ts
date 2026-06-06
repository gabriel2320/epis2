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
import { epis2Typography, epis2TypographyRoles } from './typography.js';
import { buildEpis2Shadows, buildVisualIdentity, type Epis2VisualIdentity } from './visual-identity.js';
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
    };
  }
  interface ThemeOptions {
    epis2?: Theme['epis2'];
  }
}

function resolveLegacySurfaces(mode: Epis2ThemeMode): M3SurfaceRoles {
  return mode === 'light' ? lightSurfaces : darkSurfaces;
}

/** Único generador de tema EPIS2 (M3-G01). */
export function createEpis2Theme(options: CreateEpis2ThemeOptions = {}): Theme {
  const mode = options.mode ?? 'light';
  const accent = options.accent ?? 'clinicalBlue';
  const motion = options.motion ?? 'standard';
  const density = options.density ?? 'comfortable';
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

  const visual = buildVisualIdentity(mode, activeScheme, surfaces);

  const typography =
    options.contrast === 'high'
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
      components: buildEpis2Components(motion),
      epis2: {
        themeId: epis2ThemeId,
        accent,
        surfaces,
        clinical: clinicalRoles,
        shape: epis2Shape,
        visual,
      },
    },
    esES,
  );
}

export type { Epis2Accent, ClinicalRoleKey, Epis2VisualIdentity, Epis2ApprovedThemeId };
