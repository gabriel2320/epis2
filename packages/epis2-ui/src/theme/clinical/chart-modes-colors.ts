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
  /** Cabecera documento — paleta FichaPapel clásica */
  navyHeader: '#0d2b5e',
  navyMid: '#174080',
  navyLight: '#e8edf7',
  sectionAccent: '#5fa3d8',
  /** Marfil cálido — referencia FichaPapel */
  paperBg: '#fdfcf7',
  paperBgAlt: '#f2f0e8',
  /** Fondo escritorio detrás de la hoja */
  paperCanvasBg: '#e8e6e0',
  paperInk: '#1a1a2e',
  paperInkMid: '#3a3a50',
  paperMuted: '#6a6a82',
  /** Líneas horizontales pautadas (gris papel) */
  ruledLine: '#d8d4cc',
  ruledLineStrong: '#b0aaa0',
  /** Margen vertical izquierdo tipo ficha */
  marginLine: 'rgba(150, 50, 45, 0.22)',
  /** Sombra solo pantalla (no print) */
  foldShadow: 'rgba(0, 0, 0, 0.18)',
  aiDraftUnderline: 'rgba(64, 98, 160, 0.55)',
  sectionHeaderBg: '#0d2b5e',
  sectionHeaderColor: '#FFFFFF',
  allergyAlert: '#b00020',
} as const;
