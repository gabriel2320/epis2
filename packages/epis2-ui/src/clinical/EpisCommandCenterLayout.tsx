import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export type EpisCommandCenterLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  maxWidth?: number;
};

/** Shell del Centro de Comando — home command-first. */
export function EpisCommandCenterLayout({
  children,
  header,
  maxWidth = 720,
}: EpisCommandCenterLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
        py: 3,
      }}
    >
      {header}
      <Stack
        spacing={4}
        alignItems="center"
        data-testid="epis2-command-center"
        sx={{ maxWidth, mx: 'auto' }}
      >
        {children}
      </Stack>
    </Box>
  );
}
