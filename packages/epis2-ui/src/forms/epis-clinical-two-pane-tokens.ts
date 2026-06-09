import type { SxProps, Theme } from '@mui/material/styles';
import { epis2Motion } from '../theme/motion.js';

/** Ancho mínimo para split lado a lado (LAYOUT-01). */
export const EPIS2_CLINICAL_SPLIT_MIN_PX = 960;

export function epis2ClinicalSplitTransition(reducedMotion: boolean): string {
  if (reducedMotion) return 'none';
  const props = 'flex-basis, min-width, opacity, border-color';
  return `${props} ${epis2Motion.duration.long}ms ${epis2Motion.easing.emphasized}`;
}

/** Panel de acción — escritura activa sobre el tono más claro de la escalera (canon §two-pane). */
export const epis2ClinicalActionPaneSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  bgcolor: (theme) => theme.epis2.surfaces.surfaceContainerLowest,
  overflow: 'auto',
};

/** Panel de consulta — un nivel tonal por encima: jerarquía sin sombras (canon §two-pane). */
export const epis2ClinicalContextPaneSx: SxProps<Theme> = {
  bgcolor: (theme) => theme.epis2.surfaces.surfaceContainerLow,
  overflow: 'auto',
  height: '100%',
};
