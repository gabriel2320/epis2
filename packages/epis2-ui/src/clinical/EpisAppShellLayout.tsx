import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { epis2CanvasSx } from '../theme/island-layout.js';
import { EpisNavigationRail, type EpisNavigationRailItem } from './EpisNavigationRail.js';

export type EpisAppShellLayoutProps = {
  railItems: EpisNavigationRailItem[];
  railFooter?: ReactNode;
  /** Barra superior global fija — centro operativo (UX-A). */
  appBar?: ReactNode;
  /** Barra contextual paciente + tabs (Nivel 1–2). */
  patientChrome?: ReactNode;
  railHidden?: boolean;
  /** Cuando true, el scroll vive en hijos (EpisAppScaffold) — no en el slot principal. */
  embeddedLayout?: boolean;
  children: ReactNode;
  testId?: string;
};

/** Shell global EPIS2 — Rail (N0) + columna principal con scroll independiente. */
export function EpisAppShellLayout({
  railItems,
  railFooter,
  appBar,
  patientChrome,
  railHidden = false,
  embeddedLayout = false,
  children,
  testId = 'epis2-app-shell',
}: EpisAppShellLayoutProps) {
  return (
    <Box sx={{ ...epis2CanvasSx, display: 'flex', minHeight: '100vh' }} data-testid={testId}>
      {railHidden ? null : (
        <EpisNavigationRail items={railItems} {...(railFooter ? { footer: railFooter } : {})} />
      )}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {appBar ? (
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: (theme) => theme.zIndex.appBar,
              flexShrink: 0,
            }}
          >
            {appBar}
          </Box>
        ) : null}
        {patientChrome ? (
          <Box
            sx={{
              position: 'sticky',
              top: appBar ? 56 : 0,
              zIndex: (theme) => theme.zIndex.appBar - 1,
              flexShrink: 0,
            }}
          >
            {patientChrome}
          </Box>
        ) : null}
        <Box
          sx={{
            flex: 1,
            overflow: embeddedLayout ? 'hidden' : 'auto',
            display: embeddedLayout ? 'flex' : 'block',
            flexDirection: embeddedLayout ? 'column' : undefined,
            minHeight: embeddedLayout ? 0 : undefined,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
