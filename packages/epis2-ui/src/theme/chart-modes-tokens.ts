import type { SxProps, Theme } from '@mui/material/styles';
import { epis2Shape } from './shape.js';

/** Tokens modo ficha electrónica tradicional — denso, institucional (ADR-002). */
export const epis2TraditionalChartTokens = {
  shellBg: '#EEF3F7',
  surface: '#FFFFFF',
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
  institutionalNavy: '#0B2540',
  institutionalHeaderHeight: 60,
  identityBandMinHeight: 80,
  actionBarMinHeight: 52,
  footerHeight: 36,
  allergyChipBg: '#FFF3E0',
  allergyChipBorder: '#ED6C02',
} as const;

/** Tokens modo ficha papel — documento hospitalario Carta/A5. */
export const epis2PaperChartTokens = {
  navyHeader: '#0B2540',
  paperBg: '#FAFAF8',
  ruledLine: '#C5CED8',
  marginLine: '#E8ECF0',
  letterWidthPx: 816,
  letterMinHeightPx: 1056,
  a5WidthPx: 559,
  a5MinHeightPx: 794,
  proseFontSize: 15,
  proseLineHeight: 1.55,
  sectionHeaderBg: '#0B2540',
  sectionHeaderColor: '#FFFFFF',
  institutionStampOpacity: 0.12,
} as const;

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
    width: '100%',
    maxWidth: width,
    minHeight,
    mx: 'auto',
    bgcolor: t.paperBg,
    color: 'text.primary',
    boxShadow: 1,
    borderRadius: `${epis2Shape.small}px`,
    border: 1,
    borderColor: 'divider',
    fontSize: t.proseFontSize,
    lineHeight: t.proseLineHeight,
    '@media print': {
      boxShadow: 'none',
      border: 'none',
      borderRadius: 0,
      maxWidth: '100%',
    },
  };
}
