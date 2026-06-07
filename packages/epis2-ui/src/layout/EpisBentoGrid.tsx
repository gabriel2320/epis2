import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { epis2Shape } from '../theme/shape.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';

export type EpisBentoGridProps = {
  children: ReactNode;
  testId?: string;
};

/** Grilla Bento 2×2 — espaciado grid 8px, sin bordes outlined. */
export function EpisBentoGrid({ children, testId = 'epis2-bento-grid' }: EpisBentoGridProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}

export type EpisBentoCellProps = {
  title: string;
  children: ReactNode;
  testId?: string;
};

/** Celda Bento — fondo surfaceContainer vía background.default, sin outline. */
export function EpisBentoCell({ title, children, testId }: EpisBentoCellProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        bgcolor: 'background.default',
        borderRadius: `${epis2Shape.floating}px`,
        p: 2,
        minHeight: { xs: 96, sm: 112 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <EpisM3Text role="titleMedium">{title}</EpisM3Text>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
