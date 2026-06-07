import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { epis2BarLayout, epis2Breakpoints } from '../theme/breakpoints.js';
import { EpisDockReserveLayout } from '../layout/EpisWorkspaceSection.js';

export type EpisCommandCenterLayoutProps = {
  children: ReactNode;
  maxWidth?: number;
  /** Reserva espacio inferior para EpisFloatingCommandDock. */
  reserveDockSpace?: boolean;
};

/** Shell del Centro de Comando — área central limpia + hueco para dock flotante. */
export function EpisCommandCenterLayout({
  children,
  maxWidth,
  reserveDockSpace = true,
}: EpisCommandCenterLayoutProps) {
  const isExpanded = useMediaQuery(`(min-width:${epis2Breakpoints.expanded}px)`);
  const isMedium = useMediaQuery(`(min-width:${epis2Breakpoints.medium}px)`);
  const resolvedMaxWidth =
    maxWidth ??
    (isExpanded
      ? epis2BarLayout.maxWidth.expanded
      : isMedium
        ? epis2BarLayout.maxWidth.medium
        : epis2BarLayout.maxWidth.compact);

  if (!reserveDockSpace) {
    return (
      <Box sx={{ maxWidth: resolvedMaxWidth, mx: 'auto', width: '100%' }}>
        <Stack spacing={{ xs: 2.5, md: 3 }} alignItems="stretch" data-testid="epis2-command-center" sx={{ width: '100%' }}>
          {children}
        </Stack>
      </Box>
    );
  }

  return (
    <EpisDockReserveLayout maxWidth={resolvedMaxWidth} testId="epis2-command-center">
      {children}
    </EpisDockReserveLayout>
  );
}