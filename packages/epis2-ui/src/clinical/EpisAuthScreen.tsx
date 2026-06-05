import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { epis2IslandPaddingSx, epis2IslandSx, epis2CanvasSx } from '../theme/island-layout.js';

export type EpisAuthScreenProps = {
  children: ReactNode;
  testId?: string;
};

/** Pantalla de autenticación M3 Expressive — layout acogedor centrado. */
export function EpisAuthScreen({ children, testId = 'epis2-login-page' }: EpisAuthScreenProps) {
  return (
    <Box
      sx={{
        ...epis2CanvasSx,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, sm: 4, md: 5 },
        py: { xs: 4, sm: 5 },
      }}
    >
      <EpisCard
        elevation={0}
        sx={{
          ...epis2IslandSx,
          ...epis2IslandPaddingSx,
          maxWidth: 420,
          width: '100%',
        }}
      >
        <Stack spacing={3.5} data-testid={testId}>
          {children}
        </Stack>
      </EpisCard>
    </Box>
  );
}
