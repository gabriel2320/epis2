import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { CicaClinicalNav, type CicaClinicalNavProps } from './CicaClinicalNav.js';
import { CicaTopBar, type CicaTopBarProps } from './CicaTopBar.js';
import { cicaSafeAreaInsetsSx } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

export type CicaAppShellProps = {
  topBar?: CicaTopBarProps;
  nav?: CicaClinicalNavProps;
  /** Ocultar nav en modo papel fullscreen. */
  hideNav?: boolean;
  children: ReactNode;
  testId?: string;
};

/**
 * Shell CICA Clean Room — sin sidebar, sin dashboard, sin legacy.
 * Única envoltura permitida para rutas /app/*.
 */
export function CicaAppShell({
  topBar,
  nav,
  hideNav = false,
  children,
  testId = 'cica-app-shell',
}: CicaAppShellProps) {
  return (
    <Box
      data-testid={testId}
      data-cica-clean-room="true"
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowX: 'hidden',
        bgcolor: 'background.default',
        ...cicaSafeAreaInsetsSx,
      }}
    >
      <CicaTopBar {...(topBar ?? {})} />
      {!hideNav && nav ? <CicaClinicalNav {...nav} /> : null}
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
        {children}
      </Box>
    </Box>
  );
}

export { cicaTokens };
