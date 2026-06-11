import type { SxProps, Theme } from '@mui/material/styles';
import {
  epis2ClinicalShellColors,
  epis2PaperChartColors,
  epis2TraditionalChartColors,
} from './clinical/chart-modes-colors.js';

/** Tokens modo ficha electrónica tradicional — denso, institucional (ADR-002). */
export const epis2TraditionalChartTokens = {
  shellBg: epis2TraditionalChartColors.shellBg,
  surface: epis2TraditionalChartColors.surface,
  navWidth: 240,
  navWidthCompact: 72,
  bannerHeight: 72,
  contextPaneWidth: 360,
  contentMaxWidth: 'none' as const,
  borderSubtle: '1px solid',
  borderColor: 'outlineVariant' as const,
  sectionGap: 2,
  density: 'compact' as const,
} as const;

/** Tokens anatomía shell v2 — header institucional, banda, footer (MF-DUAL-CHART-04). */
export const epis2ClinicalShellTokens = {
  institutionalNavy: epis2ClinicalShellColors.institutionalNavy,
  onInstitutional: epis2ClinicalShellColors.onInstitutional,
  institutionalHeaderHeight: 60,
  identityBandMinHeight: 80,
  actionBarMinHeight: 52,
  footerHeight: 36,
  allergyChipBg: epis2ClinicalShellColors.allergyChipBg,
  allergyChipBorder: epis2ClinicalShellColors.allergyChipBorder,
} as const;

/** Tipografía documento papel — FichaPapel clásica. */
export const epis2PaperChartTypography = {
  label: "'Source Sans 3', Arial, sans-serif",
  body: "'Courier Prime', 'Courier New', monospace",
  institution: "'Libre Baskerville', Georgia, serif",
} as const;

/** Tokens modo ficha papel — documento hospitalario Carta/A5. */
export const epis2PaperChartTokens = {
  navyHeader: epis2PaperChartColors.navyHeader,
  navyMid: epis2PaperChartColors.navyMid,
  navyLight: epis2PaperChartColors.navyLight,
  sectionAccent: epis2PaperChartColors.sectionAccent,
  paperBg: epis2PaperChartColors.paperBg,
  paperBgAlt: epis2PaperChartColors.paperBgAlt,
  paperCanvasBg: epis2PaperChartColors.paperCanvasBg,
  paperInk: epis2PaperChartColors.paperInk,
  paperInkMid: epis2PaperChartColors.paperInkMid,
  paperMuted: epis2PaperChartColors.paperMuted,
  ruledLine: epis2PaperChartColors.ruledLine,
  ruledLineStrong: epis2PaperChartColors.ruledLineStrong,
  marginLine: epis2PaperChartColors.marginLine,
  foldShadow: epis2PaperChartColors.foldShadow,
  aiDraftUnderline: epis2PaperChartColors.aiDraftUnderline,
  allergyAlert: epis2PaperChartColors.allergyAlert,
  typography: epis2PaperChartTypography,
  /** Grilla basal mm — Carta 6 · A5 5.5 (MF-PAPER-01) */
  baselineMmLetter: 6,
  baselineMmA5: 5.5,
  letterWidthMm: 215.9,
  letterHeightMm: 279.4,
  a5WidthMm: 148,
  a5HeightMm: 210,
  letterWidthPx: 816,
  letterMinHeightPx: 1056,
  a5WidthPx: 559,
  a5MinHeightPx: 794,
  proseFontSize: 12,
  proseLineHeight: 1.55,
  sectionHeaderBg: epis2PaperChartColors.sectionHeaderBg,
  sectionHeaderColor: epis2PaperChartColors.sectionHeaderColor,
  institutionStampOpacity: 0.12,
} as const;

/** Variables CSS para hoja papel (inyectar en sx del documento). */
export function epis2PaperChartCssVars(
  format: 'letter' | 'a5' = 'letter',
): Record<string, string> {
  const t = epis2PaperChartTokens;
  const baseline = format === 'a5' ? `${t.baselineMmA5}mm` : `${t.baselineMmLetter}mm`;
  return {
    '--epis2-paper-bg': t.paperBg,
    '--epis2-paper-ink': t.paperInk,
    '--epis2-paper-muted': t.paperMuted,
    '--epis2-paper-ruled-line': t.ruledLine,
    '--epis2-paper-margin-line': t.marginLine,
    '--epis2-paper-baseline': baseline,
    '--epis2-paper-fold-shadow': t.foldShadow,
  };
}

export type Epis2ChartModeTokens = {
  traditional: typeof epis2TraditionalChartTokens;
  paper: typeof epis2PaperChartTokens;
};

export const epis2ChartModeTokens: Epis2ChartModeTokens = {
  traditional: epis2TraditionalChartTokens,
  paper: epis2PaperChartTokens,
};

/** Estilos shell tradicional. */
export function epis2TraditionalChartShellSx(): SxProps<Theme> {
  return {
    bgcolor: epis2TraditionalChartTokens.shellBg,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  };
}

/** Contenedor documento papel en pantalla. */
export function epis2PaperDocumentSx(format: 'letter' | 'a5' = 'letter'): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  const width = format === 'a5' ? t.a5WidthPx : t.letterWidthPx;
  const minHeight = format === 'a5' ? t.a5MinHeightPx : t.letterMinHeightPx;
  return {
    ...epis2PaperChartCssVars(format),
    width: '100%',
    maxWidth: width,
    minHeight,
    mx: 'auto',
    bgcolor: t.paperBg,
    color: t.paperInk,
    fontFamily: t.typography.label,
    boxShadow: `0 2px 12px ${t.foldShadow}, 0 0 0 1px rgba(0, 0, 0, 0.06)`,
    borderRadius: 0,
    fontSize: t.proseFontSize,
    lineHeight: t.proseLineHeight,
    overflow: 'hidden',
    '@media print': {
      boxShadow: 'none',
      border: 'none',
      borderRadius: 0,
      maxWidth: '100%',
    },
  };
}
