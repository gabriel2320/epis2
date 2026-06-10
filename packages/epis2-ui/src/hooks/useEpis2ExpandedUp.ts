import useMediaQuery from '@mui/material/useMediaQuery';
import { epis2MediaQueries } from '../theme/breakpoints.js';

/** Viewport ≥ expanded (1280px) — supporting pane y layouts amplios. */
export function useEpis2ExpandedUp(): boolean {
  return useMediaQuery(epis2MediaQueries.expandedUp);
}
