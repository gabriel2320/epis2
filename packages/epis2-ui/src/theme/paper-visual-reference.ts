import type { SxProps, Theme } from '@mui/material/styles';
import { epis2ClinicalCalmCanvasColors } from './clinical/clinical-calm-canvas.js';
import { epis2PaperChartTokens } from './chart-modes-tokens.js';

/**
 * Referencia visual transversal modo papel EPIS2.
 * Fuente: prototipo Figma Make (no import runtime).
 * @see docs/design/EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md
 */
export const FICHAPAPEL_VISUAL_REFERENCE = {
  repository: 'https://github.com/gabriel2320/FichaPapel',
  figma:
    'https://www.figma.com/design/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica',
  primarySourceFile: 'src/app/pages/FichaMedicaPage.tsx',
  mode: 'reference' as const,
} as const;

/** Fondo escritorio cálido detrás de la hoja. */
export function epis2PaperCanvasSx(): SxProps<Theme> {
  return {
    bgcolor: epis2PaperChartTokens.paperCanvasBg,
  };
}

/**
 * Escritorio Calm Premium (THEME-CALM-01) — MF-PA-06.
 * Canvas Calm Premium (`epis2ClinicalCalmCanvasColors.light`); la hoja imprimible conserva `paperBg`.
 */
export function epis2PaperCalmCanvasSx(): SxProps<Theme> {
  return {
    bgcolor: epis2ClinicalCalmCanvasColors.light,
  };
}

/** Barra chrome fuera del área imprimible (toolbar, avisos). */
export function epis2PaperChromeBarSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    bgcolor: t.paperBgAlt,
    borderBottom: `2px solid ${t.navyHeader}`,
    px: 2,
    py: 1.25,
    fontFamily: t.typography.label,
  };
}

/** Chrome toolbar con superficie Calm Premium fuera del área imprimible — MF-PA-06. */
export function epis2PaperCalmChromeBarSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    ...epis2PaperChromeBarSx(),
    bgcolor: epis2ClinicalCalmCanvasColors.light,
    borderBottom: `2px solid ${t.navyHeader}`,
    boxShadow: 'inset 0 -1px 0 rgba(11, 92, 102, 0.14)',
  };
}

/** Botón/pestaña toolbar documento — estilo FichaPapel. */
export function epis2PaperToolbarControlSx(active = false): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.label,
    fontSize: '10px',
    fontWeight: active ? 700 : 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    px: 1.25,
    py: 0.5,
    minHeight: 32,
    cursor: 'pointer',
    border: `1px solid ${active ? t.navyHeader : t.ruledLineStrong}`,
    borderRadius: 0.5,
    bgcolor: active ? t.navyHeader : t.paperBg,
    color: active ? t.sectionHeaderColor : t.paperInkMid,
    '&:hover': {
      bgcolor: active ? t.navyHeader : t.navyLight,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };
}

/** Enlace puente print → ficha papel. */
export function epis2PaperBridgeControlSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    ...epis2PaperToolbarControlSx(false),
    borderColor: t.navyMid,
    color: t.navyHeader,
  };
}

/** Banda título sección I–VII. */
export function epis2PaperSectionTitleSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.institution,
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    bgcolor: t.sectionHeaderBg,
    color: t.sectionHeaderColor,
    px: 1.5,
    py: 0.625,
    m: 0,
    borderLeft: `4px solid ${t.sectionAccent}`,
    breakInside: 'avoid',
  };
}

/** Etiqueta campo tabulado. */
export function epis2PaperFieldLabelSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.label,
    fontSize: '9px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: t.paperMuted,
  };
}

/** Valor campo tabulado / línea clínica. */
export function epis2PaperFieldValueSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.body,
    fontSize: '12px',
    lineHeight: 1.4,
    color: t.paperInk,
    borderBottom: `1px solid ${t.ruledLineStrong}`,
    minHeight: 20,
    pb: 0.5,
  };
}

/** Cabecera institucional documento. */
export function epis2PaperInstitutionalHeaderSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    bgcolor: t.navyHeader,
    color: t.sectionHeaderColor,
    borderBottom: `3px solid ${t.navyMid}`,
  };
}

/** Franja identidad paciente. */
export function epis2PaperPatientStripSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    bgcolor: t.navyLight,
    borderBottom: `2px solid ${t.navyHeader}`,
  };
}

/** Pie legal hoja. */
export function epis2PaperFooterSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    borderTop: `1px solid ${t.ruledLine}`,
    bgcolor: t.paperBgAlt,
  };
}

/** Pestaña navegación secciones (lateral). */
export function epis2PaperNavTabSx(active = false): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.label,
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    letterSpacing: '0.04em',
    color: active ? t.sectionHeaderColor : t.navyMid,
    bgcolor: active ? t.navyHeader : 'transparent',
    borderBottom: `1px solid ${t.ruledLine}`,
    '&:hover': {
      bgcolor: active ? t.navyHeader : t.navyLight,
    },
  };
}

/** Subtítulo dentro de sección (FichaPapel SubTitle). */
export function epis2PaperSubSectionTitleSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.label,
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    bgcolor: t.navyLight,
    color: t.navyHeader,
    px: 1.5,
    py: 0.375,
    borderLeft: `3px solid ${t.navyMid}`,
    mb: 1,
  };
}

/** Cabecera tabla clínica papel. */
export function epis2PaperTableHeaderCellSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.label,
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    bgcolor: t.navyLight,
    color: t.navyHeader,
    border: `1px solid ${t.ruledLineStrong}`,
    px: 1,
    py: 0.625,
    textAlign: 'left',
  };
}

/** Celda tabla clínica papel. */
export function epis2PaperTableBodyCellSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.body,
    fontSize: '11px',
    color: t.paperInk,
    border: `1px solid ${t.ruledLine}`,
    px: 1,
    py: 0.75,
    verticalAlign: 'top',
  };
}

/** Línea de firma al pie de sección. */
export function epis2PaperSignatureLineSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    borderTop: `1px solid ${t.paperInk}`,
    width: 180,
    pt: 0.5,
    mt: 4,
    fontFamily: t.typography.label,
    fontSize: '9px',
    textAlign: 'center',
    color: t.paperInkMid,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };
}

/** Avisos borrador / IA fuera de la hoja. */
export function epis2PaperStatusCaptionSx(): SxProps<Theme> {
  const t = epis2PaperChartTokens;
  return {
    fontFamily: t.typography.label,
    fontSize: '11px',
    letterSpacing: '0.04em',
    color: t.paperInkMid,
  };
}
