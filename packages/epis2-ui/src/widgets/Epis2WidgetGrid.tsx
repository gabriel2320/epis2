import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { prefersReducedMotion } from '../theme/motion.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';

/** Debe coincidir con `WIDGET_GRID_COLUMNS` en `@epis2/epis2-widgets`. */
const WIDGET_GRID_COLUMNS = 12;

export type Epis2WidgetGridProps = {
  children: ReactNode;
  'data-testid'?: string;
};

/** Rejilla 12 columnas M3 para widgets contextuales (WIDGET-01). */
export function Epis2WidgetGrid({
  children,
  'data-testid': testId = 'epis2-widget-grid',
}: Epis2WidgetGridProps) {
  const { preferences } = useEpis2ThemePreferences();
  const reducedMotion = preferences.motion === 'reduced' || prefersReducedMotion();

  return (
    <Box
      data-testid={testId}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${WIDGET_GRID_COLUMNS}, minmax(0, 1fr))`,
        gap: 2,
        width: '100%',
        transition: reducedMotion ? 'none' : 'grid-template-columns 200ms ease',
      }}
    >
      {children}
    </Box>
  );
}
