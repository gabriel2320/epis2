import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { epis2BarLayout, epis2Breakpoints } from '../theme/breakpoints.js';
import {
  epis2CanvasSx,
  epis2IslandPaddingSx,
  epis2IslandSx,
} from '../theme/island-layout.js';

export type EpisCommandCenterLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  maxWidth?: number;
};

/** Shell del Centro de Comando — layout adaptativo M3. */
export function EpisCommandCenterLayout({
  children,
  header,
  maxWidth,
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
  return (
    <Box sx={{ ...epis2CanvasSx, px: epis2BarLayout.paddingX, py: epis2BarLayout.paddingY }}>
      <Box sx={{ maxWidth: resolvedMaxWidth, mx: 'auto', width: '100%' }}>{header}</Box>
      <Box
        sx={{
          ...epis2IslandSx,
          ...epis2IslandPaddingSx,
          maxWidth: resolvedMaxWidth,
          mx: 'auto',
          width: '100%',
          mt: { xs: 3, md: 4 },
        }}
      >
        <Stack
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
          data-testid="epis2-command-center"
          sx={{ width: '100%' }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
