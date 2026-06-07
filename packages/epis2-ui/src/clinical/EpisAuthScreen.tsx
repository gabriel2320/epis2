import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { epis2Shape } from '../theme/shape.js';

export type EpisAuthScreenProps = {
  children: ReactNode;
  testId?: string;
};

/** Gateway M3 Expressive — superficie única flotante, sin marco anidado (LAYOUT-G12). */
export function EpisAuthScreen({ children, testId = 'epis2-login-page' }: EpisAuthScreenProps) {
  const theme = useTheme();
  const visual = theme.epis2?.visual;

  return (
    <Box
      data-testid="epis2-login-gateway"
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
        bgcolor: 'background.default',
        backgroundImage: visual?.canvasGradient
          ? `linear-gradient(165deg, ${visual.canvasGradient} 0%, transparent 55%)`
          : undefined,
      }}
    >
      <Box
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: `${epis2Shape.floating}px`,
          bgcolor: 'background.paper',
          boxShadow: visual?.floatingDockShadow ?? 'none',
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={3} data-testid={testId}>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
