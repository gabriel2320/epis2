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
export {
  epis2ChartModeTokens,
  epis2TraditionalChartTokens,
  epis2PaperChartTokens,
  epis2PaperChartTypography,
  epis2TraditionalChartShellSx,
  epis2ChartMainScrollSx,
  epis2PaperDocumentSx,
} from './chart-modes-tokens.js';
export {
  FICHAPAPEL_VISUAL_REFERENCE,
  epis2PaperCanvasSx,
  epis2PaperCalmCanvasSx,
  epis2PaperChromeBarSx,
  epis2PaperCalmChromeBarSx,
  epis2PaperToolbarControlSx,
  epis2PaperBridgeControlSx,
  epis2PaperSectionTitleSx,
  epis2PaperFieldLabelSx,
  epis2PaperFieldValueSx,
  epis2PaperInstitutionalHeaderSx,
  epis2PaperPatientStripSx,
  epis2PaperFooterSx,
  epis2PaperNavTabSx,
  epis2PaperStatusCaptionSx,
} from './paper-visual-reference.js';
export {
  epis2ClassicChartTabSx,
  epis2ClassicChartTabsNavSx,
  epis2ClassicClinicalBlockSx,
  epis2ClassicClinicalTableSx,
  epis2ClassicSummaryBlockSx,
  epis2ClassicChartContentSx,
} from './clinical/classic-clinical-visual.js';
