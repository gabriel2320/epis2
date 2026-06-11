import { copy } from '@epis2/design-system';
import { EpisButton, Box, LogoutIcon, Stack } from '@epis2/epis2-ui';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { useClassicMd3Mode } from '../modes/index.js';
import { isDualChartModesEnabled } from '../dev/dualChartModesEnv.js';
import { OfflineStatusBanner } from '../components/OfflineStatusBanner.js';
import { ClinicalShellCommandPalette } from '../components/ClinicalShellCommandPalette.js';
import { ChartEspacioCommandDock } from '../components/chart/ChartEspacioCommandDock.js';
import { EpisAppScaffold } from '../components/layout/EpisAppScaffold.js';
import { EpisTopAppBar } from '../components/layout/EpisTopAppBar.js';
import { useEpisSideNavigation } from '../components/layout/EpisSideNavigation.js';
import { Epis2NavigationRailFooter } from '../navigation/epis2NavigationRail.js';
import { EpisModeGuard } from '../modes/EpisModeGuard.js';
import { ClinicalPatientChartChrome } from './ClinicalPatientChartChrome.js';

export function ClinicalShellLayout() {
  const { session, logout } = useAuth();
  const { sideNavItems } = useEpisSideNavigation();
  const isClassicMode = useClassicMd3Mode();
  const dualChartEnabled = isDualChartModesEnabled();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDualChartFicha = dualChartEnabled && !isClassicMode && pathname === '/espacio/ficha';

  useEffect(() => {
    if (!isClassicMode) {
      document.documentElement.removeAttribute('data-epis-classic-md3');
      return;
    }
    document.documentElement.setAttribute('data-epis-classic-md3', 'true');
    return () => {
      document.documentElement.removeAttribute('data-epis-classic-md3');
    };
  }, [isClassicMode]);

  const railFooter = (
    <Stack spacing={1} alignItems="center">
      <Epis2NavigationRailFooter />
      {session ? (
        <EpisButton appearance="text" size="small" startIcon={<LogoutIcon />} onClick={logout}>
          {copy.layout.logout}
        </EpisButton>
      ) : null}
    </Stack>
  );

  if (isClassicMode) {
    return (
      <>
        <EpisModeGuard enforceClassicPatient>
          <Box
            sx={{
              height: '100dvh',
              maxHeight: '100dvh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            data-testid="epis2-clinical-shell-classic"
          >
            <OfflineStatusBanner />
            <Outlet />
          </Box>
        </EpisModeGuard>
        <ClinicalShellCommandPalette />
      </>
    );
  }

  if (isDualChartFicha) {
    return (
      <>
        <Box
          sx={{
            height: '100dvh',
            maxHeight: '100dvh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          data-testid="epis2-clinical-shell-dual-chart"
        >
          <OfflineStatusBanner />
          <Outlet />
        </Box>
        <ClinicalShellCommandPalette />
      </>
    );
  }

  return (
    <>
      <EpisAppScaffold
        screenKind="workspace"
        topBar={<EpisTopAppBar active="clinical" />}
        sideNavItems={sideNavItems}
        sideNavFooter={railFooter}
        patientChrome={
          <>
            <OfflineStatusBanner />
            <ClinicalPatientChartChrome />
          </>
        }
        commandBar={dualChartEnabled ? <ChartEspacioCommandDock /> : undefined}
        testId="epis2-clinical-shell"
      >
        <Outlet />
      </EpisAppScaffold>
      <ClinicalShellCommandPalette />
    </>
  );
}
