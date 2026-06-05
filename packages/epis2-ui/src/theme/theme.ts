import { createEpis2Theme } from './create-epis2-theme.js';

/** Tema por defecto EPIS2 (M3 Clinical, acento azul clínico). */
export const epis2Theme = createEpis2Theme();

export { createEpis2Theme, type CreateEpis2ThemeOptions } from './create-epis2-theme.js';
export { buildM3PaletteOptions, accentPresets, type Epis2Accent } from './color-roles.js';
export { clinicalRoles, type ClinicalRoleKey } from './clinical-roles.js';
export { epis2Shape, epis2ShapeBorderRadius } from './shape.js';
export { epis2Motion, motionTransition, prefersReducedMotion, type Epis2MotionScheme } from './motion.js';
export { epis2Breakpoints, epis2MediaQueries, type Epis2BreakpointKey } from './breakpoints.js';
export {
  epis2Typography,
  epis2TypographyRoles,
  epis2M3TypographyVariants,
  type Epis2M3TypographyRole,
} from './typography.js';

/** @deprecated Usar buildM3PaletteOptions / theme.palette */
export { epis2Palette } from './palette-legacy.js';
