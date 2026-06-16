import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';
import { prefersReducedMotion } from '../theme/motion.js';
import { cicaFadeInUpSx, shouldAnimate } from './cicaMotion.js';

export type CicaScreenTransitionProps = {
  /** Cambia en navegación de ruta para re-disparar entrada. */
  transitionKey: string;
  children: ReactNode;
  testId?: string;
};

/**
 * Envoltura de contenido CICA — fade+slide sutil al cambiar ruta.
 * Sin animación cuando motion=reduced o prefers-reduced-motion.
 */
export function CicaScreenTransition({
  transitionKey,
  children,
  testId = 'cica-screen-transition',
}: CicaScreenTransitionProps) {
  const { preferences } = useEpis2ThemePreferences();
  const animate = shouldAnimate(preferences.motion) && !prefersReducedMotion();

  if (!animate) {
    return (
      <Box
        data-testid={testId}
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      key={transitionKey}
      data-testid={testId}
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...cicaFadeInUpSx(true),
      }}
    >
      {children}
    </Box>
  );
}
