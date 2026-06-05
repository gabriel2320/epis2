import useMediaQuery from '@mui/material/useMediaQuery';
import { EPIS2_CLINICAL_SPLIT_MIN_PX } from './epis-clinical-two-pane-tokens.js';

/** Desktop con puntero fino — habilita drag & drop en timeline (LAYOUT-04). */
export function useEpisClinicalContextDragEnabled(): boolean {
  return useMediaQuery(`(min-width: ${EPIS2_CLINICAL_SPLIT_MIN_PX}px) and (pointer: fine)`);
}
