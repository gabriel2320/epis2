import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';

export type EpisClassicMd3MainPaneProps = {
  children: ReactNode;
  actionBar?: ReactNode;
  testId?: string;
};

/** Panel principal dominante — único scroll principal del workspace clásico. */
export function EpisClassicMd3MainPane({
  children,
  actionBar,
  testId = 'epis2-classic-md3-main-pane',
}: EpisClassicMd3MainPaneProps) {
  return (
    <Box
      component="main"
      data-testid={testId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        flex: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        data-testid={`${testId}-scroll`}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          px: { xs: 1.5, md: 2 },
          py: 1.5,
        }}
      >
        {children}
      </Box>
      {actionBar ? (
        <Box
          data-testid="epis2-classic-md3-action-bar-slot"
          sx={{
            flexShrink: 0,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {actionBar}
        </Box>
      ) : null}
    </Box>
  );
}
