import { Box, epis2PaperCanvasSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type PaperPageCanvasProps = {
  children: ReactNode;
  testId?: string | undefined;
};

/** Fondo escritorio cálido + hoja centrada (FichaPapel). */
export function PaperPageCanvas({
  children,
  testId = 'epis2-paper-page-canvas',
}: PaperPageCanvasProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2PaperCanvasSx(),
        flex: 1,
        overflow: 'auto',
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
