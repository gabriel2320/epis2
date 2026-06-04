import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export type EpisAuthScreenProps = {
  children: ReactNode;
  testId?: string;
};

/** Pantalla de autenticación demo — layout centrado. */
export function EpisAuthScreen({ children, testId = 'epis2-login-page' }: EpisAuthScreenProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <EpisCard
        elevation={0}
        sx={{ p: 4, maxWidth: 440, width: '100%', border: 1, borderColor: 'divider' }}
      >
        <Stack spacing={3} data-testid={testId}>
          {children}
        </Stack>
      </EpisCard>
    </Box>
  );
}
