import type { SxProps, Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { epis2GridUnit } from './typography-rules.js';

/**
 * Canon de simetría y encuadre MD3 — docs/design/EPIS2_M3_SYMMETRY_AND_FRAMING.md.
 * Unidades MUI: theme.spacing(n) = n × 8px (modo comfortable).
 */

/** Regla 1 — cuadrícula base 8dp. */
export const epis2M3GridUnitPx = epis2GridUnit;

/** Escala de espaciado en unidades MUI (divisible por 8 o 4). */
export const epis2M3Spacing = {
  /** 4dp — icono ↔ etiqueta en botón. */
  fine: 0.5,
  /** 8dp — controles contiguos (par Cancelar / Guardar). */
  tight: 1,
  /** 16dp — filas de formulario, padding simétrico de tarjeta. */
  row: 2,
  /** 24dp — márgenes exteriores, separación entre bloques. */
  block: 3,
  /** 32dp — separación entre secciones de formulario. */
  section: 4,
} as const;

/** Regla 1 — grid de 12 columnas en escritorio. */
export const epis2M3FormColumns = 12;

/** Regla 2 — densidad y ritmo vertical de formularios clínicos. */
export const epis2M3FormLayout = {
  columns: epis2M3FormColumns,
  /** 16dp entre campos en la misma sección. */
  fieldRowGap: epis2M3Spacing.row,
  /** 16dp entre título de sección y campos. */
  sectionLabelGap: epis2M3Spacing.row,
  /** 24dp entre bloques relacionados (propósito → primera sección). */
  blockGap: epis2M3Spacing.block,
  /** 32dp entre secciones principales. */
  sectionGap: epis2M3Spacing.section,
} as const;

/** Regla 3 — área táctil mínima MD3 (48×48 dp). */
export const epis2M3TouchTargetMinPx = 48;

/** Padding simétrico de isla — 24dp compacto, 32dp expandido. */
export const epis2M3IslandPadding: SystemStyleObject<Theme> = {
  p: { xs: epis2M3Spacing.block, sm: epis2M3Spacing.block, md: epis2M3Spacing.section },
};

/** Regla 3 — fila de acciones al cierre del formulario (alineación derecha, gap 8dp). */
export const epis2ClinicalFormFooterSx: SystemStyleObject<Theme> = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: epis2M3Spacing.tight,
  width: '100%',
};

/** Footer del layout two-pane clínico. */
export const epis2ClinicalTwoPaneFooterSx: SystemStyleObject<Theme> = {
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'background.paper',
  px: { xs: epis2M3Spacing.row, sm: epis2M3Spacing.block },
  py: epis2M3Spacing.row,
};

/** Grid de 12 columnas para campos proporcionales (fase blueprint). */
export const epis2M3FormGridSx: SystemStyleObject<Theme> = {
  display: 'grid',
  gridTemplateColumns: `repeat(${epis2M3FormColumns}, minmax(0, 1fr))`,
  columnGap: epis2M3Spacing.row,
  rowGap: epis2M3FormLayout.fieldRowGap,
};

/** Span de columnas (1–12). Compacto: ancho completo; medium+: grid proporcional. */
export function epis2M3ColumnSpanSx(span: number): SxProps<Theme> {
  const clamped = Math.min(Math.max(Math.round(span), 1), epis2M3FormColumns);
  return {
    gridColumn: {
      xs: `span ${epis2M3FormColumns}`,
      sm: `span ${clamped}`,
    },
    minWidth: 0,
  };
}
