import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { epis2Breakpoints } from '../theme/breakpoints.js';

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
  const theme = useTheme();
  const isExpanded = useMediaQuery(`(min-width:${epis2Breakpoints.expanded}px)`);
  const isMedium = useMediaQuery(`(min-width:${epis2Breakpoints.medium}px)`);
  const resolvedMaxWidth = maxWidth ?? (isExpanded ? 880 : isMedium ? 720 : 480);
  const surfaces = theme.epis2?.surfaces;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: surfaces?.surfaceContainer ?? 'background.default',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      {header}
      <Stack
        spacing={{ xs: 3, md: 4 }}
        alignItems="center"
        data-testid="epis2-command-center"
        sx={{ maxWidth: resolvedMaxWidth, mx: 'auto', width: '100%' }}
      >
        {children}
      </Stack>
    </Box>
  );
}
