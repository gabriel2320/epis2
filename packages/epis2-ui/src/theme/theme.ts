import { createEpis2Theme } from './create-epis2-theme.js';

/** Tema por defecto EPIS2 (M3 Clinical, acento azul clínico). */
export const epis2Theme = createEpis2Theme();

export { createEpis2Theme, type CreateEpis2ThemeOptions } from './create-epis2-theme.js';
export { buildM3PaletteOptions, accentPresets, type Epis2Accent } from './color-roles.js';
export { clinicalRoles, type ClinicalRoleKey } from './clinical-roles.js';
export { epis2Shape, epis2ShapeBorderRadius } from './shape.js';
export { epis2Motion, motionTransition, prefersReducedMotion, type Epis2MotionScheme } from './motion.js';
export {
  epis2BarLayout,
  epis2Breakpoints,
  epis2MediaQueries,
  type Epis2BreakpointKey,
} from './breakpoints.js';
export {
  epis2Typography,
  epis2TypographyRoles,
  epis2M3TypographyVariants,
  epis2FontFamily,
  type Epis2M3TypographyRole,
} from './typography.js';
export { buildVisualIdentity, buildEpis2Shadows, type Epis2VisualIdentity } from './visual-identity.js';
export {
  epis2CanvasSx,
  epis2IslandSx,
  epis2IslandPaddingSx,
  epis2IslandMarginSx,
  epis2ShellContentIslandSx,
  epis2PageIslandSx,
  epis2PillBarSx,
} from './island-layout.js';
export { epis2DisplayFontFamily, epis2BodyFontFamily } from './typography.js';
export { epis2TonalContainerSx, epis2TonalOverlaySx } from './epis2-elevation.js';
export {
  epis2M3GridUnitPx,
  epis2M3Spacing,
  epis2M3FormColumns,
  epis2M3FormLayout,
  epis2M3TouchTargetMinPx,
  epis2M3IslandPadding,
  epis2ClinicalFormFooterSx,
  epis2ClinicalTwoPaneFooterSx,
  epis2M3FormGridSx,
  epis2M3ColumnSpanSx,
} from './m3-layout-tokens.js';

/** @deprecated Usar buildM3PaletteOptions / theme.palette */
export { epis2Palette } from './palette-legacy.js';
