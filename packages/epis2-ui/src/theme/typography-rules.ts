import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Canon tipográfico y estético EPIS2 — 20 reglas (docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md).
 */

/** Regla 2 — escala modular (base 14px × 1.2; piso clínico 13px). */
export const epis2TypeScale = {
  basePx: 14,
  ratio: 1.2,
  /** 13px — meta mínima legible */
  labelMedium: '0.8125rem',
  /** 14px — cuerpo */
  body: '0.875rem',
  /** ~17px */
  headline: '1.0625rem',
  /** 20px — display */
  display: '1.25rem',
} as const;

/** Regla 3 — longitud de línea óptima para prosa clínica. */
export const epis2ProseMaxWidth = '65ch';

/** Regla 4 — interlineado cuerpo 1.5; encabezados 1.2. */
export const epis2LineHeight = {
  body: 1.5,
  heading: 1.2,
  table: 1.35,
} as const;

/** Regla 5 — números tabulares (métricas, dosis, tablas). */
export const epis2TabularNumsSx: SxProps<Theme> = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum"',
};

/** Regla 3+4 — bloques de texto clínico (evolución, epicrisis, notas). */
export const epis2ClinicalProseSx: SxProps<Theme> = {
  maxWidth: epis2ProseMaxWidth,
  lineHeight: epis2LineHeight.body,
  textAlign: 'left',
};

/** Regla 8 — cifras alineadas a la derecha en tablas densas. */
export const epis2NumericCellSx: SxProps<Theme> = {
  ...epis2TabularNumsSx,
  textAlign: 'right',
};

/** Regla 9 — tracking en meta pequeña y display. */
export const epis2LetterSpacing = {
  caption: '0.02em',
  display: '-0.02em',
} as const;

/** Regla 11 — cuadrícula 8pt (spacing MUI = 8 en modo comfortable). */
export const epis2GridUnit = 8;

/** Regla 13 — sin negro puro en UI. */
export const epis2ForbiddenColors = {
  pureBlack: '#000000',
  pureWhiteTextOnDark: '#FFFFFF',
} as const;

/** Regla 20 — duración de transición funcional (ms). */
export const epis2InteractionDuration = {
  min: 150,
  max: 300,
} as const;
