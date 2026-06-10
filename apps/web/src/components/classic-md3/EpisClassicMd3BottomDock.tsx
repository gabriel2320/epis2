import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';

export type EpisClassicMd3BottomDockProps = {
  commandBar: ReactNode;
  statusBar: ReactNode;
  testId?: string;
};

/** Dock inferior — command bar + estado en una sola franja (UX P2). */
export function EpisClassicMd3BottomDock({
  commandBar,
  statusBar,
  testId = 'epis2-classic-md3-bottom-dock',
}: EpisClassicMd3BottomDockProps) {
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
