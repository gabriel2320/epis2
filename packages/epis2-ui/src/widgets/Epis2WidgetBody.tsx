import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

export type Epis2WidgetBodyProps = {
  children: ReactNode;
};

export function Epis2WidgetBody({ children }: Epis2WidgetBodyProps) {
  return (
    <Box
      data-testid="epis2-widget-body"
      sx={{ flex: 1, px: 0.5, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      {children}
    </Box>
  );
}
