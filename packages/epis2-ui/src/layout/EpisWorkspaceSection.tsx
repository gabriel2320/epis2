import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2ShellContentSx } from '../theme/island-layout.js';

export type EpisWorkspaceSectionProps = {
  title: string;
  children: ReactNode;
  testId?: string;
};

/** Sección plana UX-B — tipografía + surfaceContainer, sin Paper outlined (LAYOUT-G12). */
export function EpisWorkspaceSection({ title, children, testId }: EpisWorkspaceSectionProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        width: '100%',
        bgcolor: 'background.default',
        borderRadius: 2,
        p: 2,
      }}
    >
      <EpisM3Text role="headlineMedium" component="h2" sx={{ m: 0, mb: 1.5 }}>
        {title}
      </EpisM3Text>
      {children}
    </Box>
  );
}

export type EpisDockReserveLayoutProps = {
  children: ReactNode;
  maxWidth?: number | string;
  testId?: string;
};

/** Reserva espacio inferior para EpisFloatingCommandDock. */
export function EpisDockReserveLayout({ children, maxWidth, testId }: EpisDockReserveLayoutProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        ...epis2ShellContentSx,
        ...(maxWidth ? { maxWidth } : {}),
        width: '100%',
        flex: 1,
        pb: { xs: 22, sm: 24 },
        minHeight: { xs: '40vh', sm: '45vh' },
      }}
    >
      <Stack spacing={{ xs: 2, sm: 2.5 }} sx={{ width: '100%' }}>
        {children}
      </Stack>
    </Box>
  );
}
