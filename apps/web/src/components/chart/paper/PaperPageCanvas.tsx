import { Box, epis2TraditionalChartTokens } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type PaperPageCanvasProps = {
  children: ReactNode;
  testId?: string | undefined;
};

/** Fondo gris frío + hoja centrada (MF-DUAL-CHART-06). */
export function PaperPageCanvas({
  children,
  testId = 'epis2-paper-page-canvas',
}: PaperPageCanvasProps) {
  const shellBg = epis2TraditionalChartTokens.shellBg;

  return (
    <Box
      data-testid={testId}
      sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: shellBg,
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
