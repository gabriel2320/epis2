import { copy } from '@epis2/design-system';
import { EpisAppShellLayout, EpisButton, LogoutIcon, Stack } from '@epis2/epis2-ui';
import { Outlet } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext.js';
import { ClinicalPatientChartChrome } from './ClinicalPatientChartChrome.js';
import { OfflineStatusBanner } from '../components/OfflineStatusBanner.js';
import {
  Epis2NavigationRailFooter,
  useEpis2NavigationRailItems,
} from '../navigation/epis2NavigationRail.js';

export function ClinicalShellLayout() {
  const { session, logout } = useAuth();
  const railItems = useEpis2NavigationRailItems();

  return (
    <EpisAppShellLayout
      railItems={railItems}
      railFooter={
        <Stack spacing={1} alignItems="center">
          <Epis2NavigationRailFooter />
          {session ? (
            <EpisButton appearance="text" size="small" startIcon={<LogoutIcon />} onClick={logout}>
              {copy.layout.logout}
            </EpisButton>
          ) : null}
        </Stack>
      }
      patientChrome={
        <>
          <OfflineStatusBanner />
          <ClinicalPatientChartChrome />
        </>
      }
      testId="epis2-clinical-shell"
    >
      <Outlet />
    </EpisAppShellLayout>
  );
}
