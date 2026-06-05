import type { SxProps, Theme } from '@mui/material/styles';
import { epis2Motion } from '../theme/motion.js';

/** Ancho mínimo para split lado a lado (LAYOUT-01). */
export const EPIS2_CLINICAL_SPLIT_MIN_PX = 960;

export function epis2ClinicalSplitTransition(reducedMotion: boolean): string {
  if (reducedMotion) return 'none';
  const props = 'flex-basis, min-width, opacity, border-color';
  return `${props} ${epis2Motion.duration.long}ms ${epis2Motion.easing.emphasized}`;
}

/** Panel de acción — superficie más clara (escritura activa). */
export const epis2ClinicalActionPaneSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  bgcolor: 'background.paper',
  overflow: 'auto',
};

/** Panel de consulta — superficie marginalmente más apagada. */
export const epis2ClinicalContextPaneSx: SxProps<Theme> = {
  bgcolor: 'background.default',
  overflow: 'auto',
  height: '100%',
};
