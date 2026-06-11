import { Box, epis2ChartMainScrollSx, epis2PaperCalmCanvasSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type PaperPageCanvasProps = {
  children: ReactNode;
  testId?: string | undefined;
};

/** Fondo Calm Premium + hoja centrada (FichaPapel). */
export function PaperPageCanvas({
  children,
  testId = 'epis2-paper-page-canvas',
}: PaperPageCanvasProps) {
  return (
    <Box
      data-testid={testId}
      data-epis2-chart-scroll="main"
      data-epis2-paper-calm-canvas="true"
      sx={{
        ...(epis2PaperCalmCanvasSx() as Record<string, unknown>),
        ...(epis2ChartMainScrollSx() as Record<string, unknown>),
        py: 3,
        px: { xs: 1, md: 3 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '100%' }}>{children}</Box>
    </Box>
  );
}
