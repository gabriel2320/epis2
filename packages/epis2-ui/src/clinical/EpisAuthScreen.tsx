import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { epis2Shape } from '../theme/shape.js';
import { motionTransition } from '../theme/motion.js';

export type EpisAuthScreenProps = {
  children: ReactNode;
  testId?: string;
};

/** Pantalla de autenticación M3 Expressive — layout acogedor centrado. */
export function EpisAuthScreen({ children, testId = 'epis2-login-page' }: EpisAuthScreenProps) {
  const theme = useTheme();
  const surfaces = theme.epis2?.surfaces;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: surfaces?.surfaceContainer ?? 'background.default',
        px: 2,
      }}
    >
      <EpisCard
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 440,
          width: '100%',
          borderRadius: epis2Shape.extraLarge,
          border: 1,
          borderColor: 'divider',
          bgcolor: surfaces?.surface ?? 'background.paper',
          transition: motionTransition(['box-shadow', 'transform']),
        }}
      >
        <Stack spacing={3} data-testid={testId}>
          {children}
        </Stack>
      </EpisCard>
    </Box>
  );
}
