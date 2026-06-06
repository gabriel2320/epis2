import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { epis2CanvasSx } from '../theme/island-layout.js';
import { EpisNavigationRail, type EpisNavigationRailItem } from './EpisNavigationRail.js';

export type EpisAppShellLayoutProps = {
  railItems: EpisNavigationRailItem[];
  railFooter?: ReactNode;
  /** Barra contextual paciente + tabs (Nivel 1–2). */
  patientChrome?: ReactNode;
  children: ReactNode;
  testId?: string;
};

/** Shell global EPIS2 — Rail (N0) + columna principal con scroll independiente. */
export function EpisAppShellLayout({
  railItems,
  railFooter,
  patientChrome,
  children,
  testId = 'epis2-app-shell',
}: EpisAppShellLayoutProps) {
  return (
    <Box sx={{ ...epis2CanvasSx, display: 'flex', minHeight: '100vh' }} data-testid={testId}>
      <EpisNavigationRail items={railItems} {...(railFooter ? { footer: railFooter } : {})} />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {patientChrome}
        <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
