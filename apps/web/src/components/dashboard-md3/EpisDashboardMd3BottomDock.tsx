import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';

export type EpisDashboardMd3BottomDockProps = {
  commandBar: ReactNode;
  statusBar: ReactNode;
  testId?: string;
};

/** Dock inferior dashboard — command bar + estado unificados (UX P2). */
export function EpisDashboardMd3BottomDock({
  commandBar,
  statusBar,
  testId = 'epis2-dashboard-md3-bottom-dock',
}: EpisDashboardMd3BottomDockProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        flexShrink: 0,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {commandBar}
      {statusBar}
    </Box>
  );
}
