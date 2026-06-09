import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';

export type EpisClassicMd3ShellProps = {
  topAppBar: ReactNode;
  patientHeader: ReactNode;
  leftNavigation: ReactNode;
  mainPane: ReactNode;
  supportingPane?: ReactNode;
  actionRail?: ReactNode;
  commandBar?: ReactNode;
  statusBar: ReactNode;
  testId?: string;
};

/** Scaffold MD3 modo clásico — 100dvh, scroll principal solo en main pane. */
export function EpisClassicMd3Shell({
  topAppBar,
  patientHeader,
  leftNavigation,
  mainPane,
  supportingPane,
  actionRail,
  commandBar,
  statusBar,
  testId = 'epis2-classic-md3-shell',
}: EpisClassicMd3ShellProps) {
  return (
    <Box
      data-testid={testId}
      data-epis-classic-md3="true"
      data-epis-scroll-policy="main-pane-only"
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto auto',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>{topAppBar}</Box>
      <Box sx={{ flexShrink: 0 }}>{patientHeader}</Box>

      <Box
        sx={{
          display: 'grid',
          minHeight: 0,
          gridTemplateColumns: {
            xs: '1fr',
            sm: actionRail ? 'auto minmax(0, 1fr) auto' : 'auto minmax(0, 1fr)',
            md: supportingPane
              ? 'auto minmax(0, 1fr) minmax(280px, 360px) auto'
              : 'auto minmax(0, 1fr) auto',
          },
        }}
      >
        <Box
          sx={{
            minHeight: 0,
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' },
          }}
        >
          {leftNavigation}
        </Box>
        <Box sx={{ minHeight: 0, minWidth: 0, overflow: 'hidden' }}>{mainPane}</Box>
        {supportingPane ? (
          <Box
            sx={{
              minHeight: 0,
              overflow: 'hidden',
              display: { xs: 'none', lg: 'block' },
            }}
          >
            {supportingPane}
          </Box>
        ) : null}
        {actionRail ? (
          <Box sx={{ minHeight: 0, display: { xs: 'none', sm: 'block' } }}>{actionRail}</Box>
        ) : null}
      </Box>

      {commandBar ? <Box sx={{ flexShrink: 0 }}>{commandBar}</Box> : null}
      <Box sx={{ flexShrink: 0 }}>{statusBar}</Box>
    </Box>
  );
}
