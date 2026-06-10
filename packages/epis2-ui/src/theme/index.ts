/** Barrel del subsistema de tema EPIS2 (THEME-01). */
export { createEpis2Theme, type CreateEpis2ThemeOptions } from './create-epis2-theme.js';
export { epis2Theme } from './theme.js';
export { clinicalRoles, type ClinicalRoleKey } from './clinical-roles.js';
export {
  clinicalSemanticRoles,
  type ClinicalSemanticRoleKey,
} from './clinical/clinical-semantic-roles.js';
export {
  MATERIAL_THEME_METADATA,
  clinicalBlueLightScheme,
  clinicalBlueDarkScheme,
  calmTealLightScheme,
  calmTealDarkScheme,
  type GeneratedThemeId,
} from './generated/index.js';
export type {
  Epis2MaterialColorScheme,
  Epis2ThemeOptions,
  MaterialThemeSourceMetadata,
} from './contracts/material-color-scheme.js';
