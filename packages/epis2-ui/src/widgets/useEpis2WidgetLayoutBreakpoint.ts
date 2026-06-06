import useMediaQuery from '@mui/material/useMediaQuery';
import { epis2MediaQueries } from '../theme/breakpoints.js';

/** Alias alineado con `WidgetLayoutBreakpoint` en `@epis2/epis2-widgets`. */
export type Epis2WidgetLayoutBreakpoint = 'compact' | 'medium' | 'expanded';

/** Breakpoint activo para rejilla de widgets (M3-06 / WIDGET-01). */
export function useEpis2WidgetLayoutBreakpoint(): Epis2WidgetLayoutBreakpoint {
  const expanded = useMediaQuery(epis2MediaQueries.expandedUp);
  const medium = useMediaQuery(epis2MediaQueries.mediumUp);
  if (expanded) return 'expanded';
  if (medium) return 'medium';
  return 'compact';
}
