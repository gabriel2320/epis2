/**
 * Colores fijos modo dual-chart — allowlist `theme/clinical` (validate-no-hardcoded-colors).
 * ADR-002 · MF-DUAL-CHART-04.
 */
export const epis2TraditionalChartColors = {
  shellBg: '#EEF3F7',
  surface: '#FFFFFF',
} as const;

export const epis2ClinicalShellColors = {
  institutionalNavy: '#0B2540',
  onInstitutional: '#FFFFFF',
  allergyChipBg: '#FFF3E0',
  allergyChipBorder: '#ED6C02',
} as const;

export const epis2PaperChartColors = {
  navyHeader: '#0B2540',
  paperBg: '#FAFAF8',
  ruledLine: '#C5CED8',
  marginLine: '#E8ECF0',
  sectionHeaderBg: '#0B2540',
  sectionHeaderColor: '#FFFFFF',
} as const;
