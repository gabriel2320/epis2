import type { ReactNode } from 'react';
import { Box } from '@epis2/epis2-ui';

export type EpisDashboardMd3ShellProps = {
  topBar: ReactNode;
  scopeBar: ReactNode;
  navigationRail: ReactNode;
  kpiStrip?: ReactNode;
  mainGrid: ReactNode;
  detailPane?: ReactNode;
  commandBar?: ReactNode;
  statusBar: ReactNode;
  testId?: string;
};

/** Scaffold MD3 modo dashboard — 100dvh, scroll principal solo en main grid. */
export function EpisDashboardMd3Shell({
  topBar,
  scopeBar,
  navigationRail,
  kpiStrip,
  mainGrid,
  detailPane,
  commandBar,
  statusBar,
  testId = 'epis2-dashboard-md3-shell',
}: EpisDashboardMd3ShellProps) {
  return (
    <Box
      data-testid={testId}
      data-epis-dashboard-md3="true"
      data-epis-scroll-policy="main-grid-only"
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto auto minmax(0, 1fr) auto auto',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>{topBar}</Box>
      <Box sx={{ flexShrink: 0 }}>{scopeBar}</Box>

      <Box
        sx={{
          display: 'grid',
          minHeight: 0,
          gridTemplateColumns: {
            xs: '1fr',
            sm: detailPane ? 'auto minmax(0, 1fr) minmax(240px, 320px)' : 'auto minmax(0, 1fr)',
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
          {navigationRail}
        </Box>
        <Box
          sx={{
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {kpiStrip ? <Box sx={{ flexShrink: 0 }}>{kpiStrip}</Box> : null}
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{mainGrid}</Box>
        </Box>
        {detailPane ? (
          <Box
            sx={{
              minHeight: 0,
              overflow: 'hidden',
              display: { xs: 'none', lg: 'block' },
            }}
          >
            {detailPane}
          </Box>
        ) : null}
      </Box>

      {commandBar ? <Box sx={{ flexShrink: 0 }}>{commandBar}</Box> : null}
      <Box sx={{ flexShrink: 0 }}>{statusBar}</Box>
    </Box>
  );
}
