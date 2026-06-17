import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { CicaClinicalNav, type CicaClinicalNavProps } from './CicaClinicalNav.js';
import { CicaTopBar, type CicaTopBarProps } from './CicaTopBar.js';
import { resolveCicaEpis2gSurfaces } from './cicaEpis2gVisual.js';
import { cicaSafeAreaInsetsSx } from './cicaResponsive.js';
import { useCicaThemeTokens } from './useCicaThemeTokens.js';

export type CicaAppShellProps = {
  topBar?: CicaTopBarProps;
  /** Sidebar contextual (sistema + paciente). */
  sidebar?: ReactNode;
  /** Ocultar sidebar en papel / documento carta fullscreen. */
  hideSidebar?: boolean;
  /** Nav horizontal legacy — omitir cuando hay sidebar. */
  nav?: CicaClinicalNavProps;
  hideNav?: boolean;
  children: ReactNode;
  testId?: string;
};

/**
 * Shell CICA Clean Room — top bar + sidebar útil + contenido.
 * Única envoltura permitida para rutas /app/*.
 */
export function CicaAppShell({
  topBar,
  sidebar,
  hideSidebar = false,
  nav,
  hideNav = false,
  children,
  testId = 'cica-app-shell',
}: CicaAppShellProps) {
  const { isDark } = useCicaThemeTokens();
  const surfaces = resolveCicaEpis2gSurfaces(isDark);
  const showSidebar = Boolean(sidebar) && !hideSidebar;
  const showTopNav = Boolean(nav) && !hideNav && !showSidebar;

  return (
    <Box
      data-testid={testId}
      data-cica-clean-room="true"
      data-cica-visual="epis2g"
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowX: 'hidden',
        bgcolor: surfaces.contentCanvas,
        ...cicaSafeAreaInsetsSx,
      }}
    >
      <CicaTopBar {...(topBar ?? {})} />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {showSidebar ? sidebar : null}
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {showTopNav ? <CicaClinicalNav {...nav!} /> : null}
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export { cicaTokens } from './cicaTokens.js';
