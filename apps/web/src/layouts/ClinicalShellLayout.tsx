/** @legacy-runtime Shell clínico activo — `/espacio/*` hasta CICA-L GO. No expandir; ver PROG-PURGE-CICA. */
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
import { ClinicalNavStrip } from './ClinicalNavStrip.js';

export function ClinicalShellLayout() {
  const { session, logout } = useAuth();
  const { sideNavItems } = useEpisSideNavigation();
  const isClassicMode = useClassicMd3Mode();
  const dualChartEnabled = isDualChartModesEnabled();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isEspacioRoute = pathname.startsWith('/espacio/');
  const isDualChartMinimalShell = dualChartEnabled && !isClassicMode && isEspacioRoute;
  const isPatientSearch = pathname.startsWith('/espacio/buscar-paciente');

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

  if (isDualChartMinimalShell) {
    return (
      <>
        <EpisModeGuard>
          <Box
            sx={{
              height: '100dvh',
              maxHeight: '100dvh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            data-testid={
              isPatientSearch
                ? 'epis2-clinical-shell-patient-search'
                : 'epis2-clinical-shell-minimal'
            }
          >
            <OfflineStatusBanner />
            <ClinicalNavStrip />
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </EpisModeGuard>
        <ClinicalShellCommandPalette />
      </>
    );
  }

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

  return (
    <>
      <EpisAppScaffold
        screenKind="workspace"
        topBar={<EpisTopAppBar active="clinical" />}
        sideNavItems={sideNavItems}
        sideNavFooter={railFooter}
        railHidden={dualChartEnabled}
        patientChrome={
          <>
            <OfflineStatusBanner />
            <ClinicalPatientChartChrome />
          </>
        }
        commandBar={dualChartEnabled ? undefined : <ChartEspacioCommandDock />}
        testId="epis2-clinical-shell"
      >
        <Outlet />
      </EpisAppScaffold>
      <ClinicalShellCommandPalette />
    </>
  );
}
