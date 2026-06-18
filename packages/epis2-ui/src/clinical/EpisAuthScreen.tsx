import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2Shape } from '../theme/shape.js';

export type EpisAuthScreenProps = {
  children: ReactNode;
  /** Panel institucional (marca, tagline) — columna izquierda en md+. */
  brand?: ReactNode;
  footer?: ReactNode;
  testId?: string;
};

/** Acceso M3 — split responsive, tema claro/oscuro vía Epis2ThemeProvider. */
export function EpisAuthScreen({
  children,
  brand,
  footer,
  testId = 'epis2-login-page',
}: EpisAuthScreenProps) {
  const theme = useTheme();
  const visual = theme.epis2?.visual;
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      data-testid="epis2-login-gateway"
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: brand ? 'minmax(280px, 1fr) minmax(360px, 480px)' : '1fr',
        },
        bgcolor: 'background.default',
      }}
    >
      {brand ? (
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            px: { md: 5, lg: 7 },
            py: 5,
            color: 'primary.contrastText',
            background: isDark
              ? `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(160deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 88%)`,
          }}
          data-testid="epis2-login-brand-panel"
        >
          {brand}
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 5 },
          backgroundImage: visual?.canvasGradient
            ? `linear-gradient(180deg, ${visual.canvasGradient} 0%, transparent 40%)`
            : undefined,
        }}
      >
        <Box
          component="section"
          sx={{
            width: '100%',
            maxWidth: 440,
            borderRadius: `${epis2Shape.floating}px`,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            boxShadow: visual?.floatingDockShadow ?? theme.shadows[2],
            p: { xs: 3, sm: 4 },
          }}
        >
          <Stack spacing={3} data-testid={testId}>
            {children}
          </Stack>
        </Box>
        {footer ? (
          <Box sx={{ mt: 2, maxWidth: 440, width: '100%', textAlign: 'center' }}>{footer}</Box>
        ) : null}
      </Box>
    </Box>
  );
}

export function EpisAuthBrandTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Stack spacing={2} data-testid="epis2-login-brand-copy">
      <EpisM3Text role="displayMedium" component="p" sx={{ color: 'inherit', fontWeight: 600 }}>
        {title}
      </EpisM3Text>
      <EpisM3Text
        role="bodyLarge"
        component="p"
        sx={{ color: 'inherit', opacity: 0.92, maxWidth: 420 }}
      >
        {subtitle}
      </EpisM3Text>
    </Stack>
  );
}
