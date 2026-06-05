import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import { epis2IslandPaddingSx, epis2IslandSx } from '../theme/island-layout.js';

export type Epis2WidgetSurfaceProps = {
  children: ReactNode;
  columnSpan?: number;
  minHeight?: number;
  testId?: string;
};

/** Contenedor M3 de un widget contextual — no sustituye el Centro de Comando. */
export function Epis2WidgetSurface({
  children,
  columnSpan = 12,
  minHeight = 140,
  testId,
}: Epis2WidgetSurfaceProps) {
  return (
    <EpisCard
      variant="outlined"
      data-testid={testId ?? 'epis2-widget-surface'}
      sx={{
        gridColumn: `span ${columnSpan}`,
        minHeight,
        ...epis2IslandSx,
        ...epis2IslandPaddingSx,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {children}
    </EpisCard>
  );
}
