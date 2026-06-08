import { copy } from '@epis2/design-system';
import { EpisButton, LogoutIcon, Stack } from '@epis2/epis2-ui';
import { Outlet } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext.js';
import { OfflineStatusBanner } from '../components/OfflineStatusBanner.js';
import { ClinicalShellCommandPalette } from '../components/ClinicalShellCommandPalette.js';
import { EpisAppScaffold } from '../components/layout/EpisAppScaffold.js';
import { EpisTopAppBar } from '../components/layout/EpisTopAppBar.js';
import { useEpisSideNavigation } from '../components/layout/EpisSideNavigation.js';
import { Epis2NavigationRailFooter } from '../navigation/epis2NavigationRail.js';
import { ClinicalPatientChartChrome } from './ClinicalPatientChartChrome.js';

export function ClinicalShellLayout() {
  const { session, logout } = useAuth();
  const { sideNavItems } = useEpisSideNavigation();

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
        testId="epis2-clinical-shell"
      >
        <Outlet />
      </EpisAppScaffold>
      <ClinicalShellCommandPalette />
    </>
  );
}
