import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import type { CicaLayoutProfile } from './cicaTokens.js';
import { cicaResponsiveContainerSx } from './cicaResponsive.js';

export type CicaResponsiveContainerProps = {
  /** Perfil CICA — fija max-width; omitir para fluido 100%. */
  profile?: CicaLayoutProfile;
  children: ReactNode;
  testId?: string;
  /** Permite extender sx sin perder reglas responsive base. */
  sx?: Parameters<typeof Box>[0]['sx'];
};

/**
 * Centra contenido CICA con max-width por perfil, padding horizontal responsive
 * y overflow-x oculto — evita scroll horizontal en viewports estrechos (375px).
 */
export function CicaResponsiveContainer({
  profile,
  children,
  testId = 'cica-responsive-container',
  sx,
}: CicaResponsiveContainerProps) {
  return (
    <Box
      data-testid={testId}
      data-cica-profile={profile ?? 'fluid'}
      sx={[cicaResponsiveContainerSx(profile), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      {children}
    </Box>
  );
}
