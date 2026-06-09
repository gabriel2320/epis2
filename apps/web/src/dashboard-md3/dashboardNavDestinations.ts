import { copy } from '@epis2/design-system';
import type { DashboardTab } from '../routes/clinicalNavigate.js';

/** Máximo de destinos visibles en navigation rail MD3. */
export const EPIS_DASHBOARD_NAV_MAX_VISIBLE = 7;

export type DashboardNavDestination = {
  id: DashboardTab;
  label: string;
  group: 'primary' | 'more';
  testId: string;
};

export const DASHBOARD_NAV_DESTINATIONS: readonly DashboardNavDestination[] = [
  {
    id: 'work',
    label: copy.dashboardMd3.navWork,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-work',
  },
  {
    id: 'patient',
    label: copy.dashboardMd3.navPatient,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-patient',
  },
  {
    id: 'service',
    label: copy.dashboardMd3.navService,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-service',
  },
  {
    id: 'nursing',
    label: copy.dashboardMd3.navNursing,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-nursing',
  },
  {
    id: 'pharmacy',
    label: copy.dashboardMd3.navPharmacy,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-pharmacy',
  },
  {
    id: 'icu',
    label: copy.dashboardMd3.navIcuEmergency,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-icu',
  },
  {
    id: 'quality',
    label: copy.dashboardMd3.navQuality,
    group: 'primary',
    testId: 'epis2-dashboard-md3-nav-quality',
  },
  {
    id: 'reception',
    label: copy.dashboard.tabReception,
    group: 'more',
    testId: 'epis2-dashboard-md3-nav-reception',
  },
  {
    id: 'emergency',
    label: copy.dashboard.tabEmergency,
    group: 'more',
    testId: 'epis2-dashboard-md3-nav-emergency',
  },
  {
    id: 'or',
    label: copy.dashboard.tabOr,
    group: 'more',
    testId: 'epis2-dashboard-md3-nav-or',
  },
  {
    id: 'aps',
    label: copy.dashboard.tabAps,
    group: 'more',
    testId: 'epis2-dashboard-md3-nav-aps',
  },
  {
    id: 'specialty',
    label: copy.dashboard.tabSpecialty,
    group: 'more',
    testId: 'epis2-dashboard-md3-nav-specialty',
  },
];

export function visibleDashboardNavDestinations(
  allowedTabs: ReadonlySet<DashboardTab>,
): {
  primary: DashboardNavDestination[];
  more: DashboardNavDestination[];
} {
  const filtered = DASHBOARD_NAV_DESTINATIONS.filter((d) => allowedTabs.has(d.id));
  const primary = filtered.filter((d) => d.group === 'primary').slice(0, EPIS_DASHBOARD_NAV_MAX_VISIBLE);
  const more = filtered.filter((d) => d.group === 'more');
  return { primary, more };
}
