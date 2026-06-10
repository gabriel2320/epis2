import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';

export type EpisClassicMd3ShellProps = {
  topAppBar: ReactNode;
  patientHeader: ReactNode;
  mobileNav?: ReactNode;
  leftNavigation: ReactNode;
  mainPane: ReactNode;
  supportingPane?: ReactNode;
  actionRail?: ReactNode;
  bottomDock: ReactNode;
  testId?: string;
};

/** Scaffold MD3 modo clásico — 100dvh, scroll principal solo en main pane. */
export function EpisClassicMd3Shell({
  topAppBar,
  patientHeader,
  mobileNav,
  leftNavigation,
  mainPane,
  supportingPane,
  actionRail,
  bottomDock,
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
        gridTemplateRows: mobileNav
          ? 'auto auto auto minmax(0, 1fr) auto'
          : 'auto auto minmax(0, 1fr) auto',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>{topAppBar}</Box>
      <Box sx={{ flexShrink: 0 }}>{patientHeader}</Box>
      {mobileNav ? <Box sx={{ flexShrink: 0 }}>{mobileNav}</Box> : null}

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
        <Box sx={{ minHeight: 0, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {mainPane}
        </Box>
        {supportingPane ? (
          <Box
            sx={{
              minHeight: 0,
              overflow: 'hidden',
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
            }}
          >
            {supportingPane}
          </Box>
        ) : null}
        {actionRail ? (
          <Box sx={{ minHeight: 0, display: { xs: 'none', sm: 'block' } }}>{actionRail}</Box>
        ) : null}
      </Box>

      <Box sx={{ flexShrink: 0 }}>{bottomDock}</Box>
    </Box>
  );
}
