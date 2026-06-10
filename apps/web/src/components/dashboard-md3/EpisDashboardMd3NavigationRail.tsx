import { copy } from '@epis2/design-system';
import {
  AdminPanelSettingsIcon,
  BoltIcon,
  CalendarMonthIcon,
  EpisButton,
  GroupsIcon,
  HealthAndSafetyIcon,
  LocalHospitalIcon,
  MedicationIcon,
  MonitorHeartIcon,
  PersonOutlineIcon,
  ScienceIcon,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import type { DashboardTab } from '../../routes/clinicalNavigate.js';
import type { DashboardNavDestination } from '../../dashboard-md3/dashboardNavDestinations.js';
import { EPIS_DASHBOARD_NAV_MAX_VISIBLE } from '../../dashboard-md3/dashboardNavDestinations.js';

export type EpisDashboardMd3NavigationRailProps = {
  primary: readonly DashboardNavDestination[];
  more: readonly DashboardNavDestination[];
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  moreOpen?: boolean;
  onMoreToggle?: () => void;
  testId?: string;
};

const NAV_ICONS: Partial<Record<DashboardTab, ReactNode>> = {
  work: <BoltIcon fontSize="small" />,
  patient: <PersonOutlineIcon fontSize="small" />,
  service: <GroupsIcon fontSize="small" />,
  nursing: <LocalHospitalIcon fontSize="small" />,
  pharmacy: <MedicationIcon fontSize="small" />,
  icu: <MonitorHeartIcon fontSize="small" />,
  quality: <HealthAndSafetyIcon fontSize="small" />,
  reception: <CalendarMonthIcon fontSize="small" />,
  emergency: <MonitorHeartIcon fontSize="small" />,
  or: <ScienceIcon fontSize="small" />,
  aps: <GroupsIcon fontSize="small" />,
  specialty: <AdminPanelSettingsIcon fontSize="small" />,
};

/** Navigation rail — máx. 7 destinos visibles; resto bajo “Más”. */
export function EpisDashboardMd3NavigationRail({
  primary,
  more,
  activeTab,
  onTabChange,
  moreOpen = false,
  onMoreToggle,
  testId = 'epis2-dashboard-md3-nav-rail',
}: EpisDashboardMd3NavigationRailProps) {
  if (primary.length > EPIS_DASHBOARD_NAV_MAX_VISIBLE) {
    throw new Error(`Navigation rail excede ${EPIS_DASHBOARD_NAV_MAX_VISIBLE} destinos visibles`);
  }

  const renderNavButton = (dest: DashboardNavDestination) => {
    const active = dest.id === activeTab;
    return (
      <EpisButton
        key={dest.id}
        appearance={active ? 'filled' : 'text'}
        size="small"
        title={dest.label}
        onClick={() => onTabChange(dest.id)}
        data-testid={dest.testId}
        sx={{
          flexDirection: 'column',
          gap: 0.25,
          minHeight: 56,
          fontSize: '0.65rem',
          lineHeight: 1.2,
          px: 0.5,
        }}
      >
        {NAV_ICONS[dest.id] ?? <BoltIcon fontSize="small" />}
        <span>{dest.label.slice(0, 8)}</span>
      </EpisButton>
    );
  };

  return (
    <Stack
      data-testid={testId}
      data-epis-nav-visible-count={primary.length}
      spacing={0.5}
      sx={{
        width: 88,
        py: 1,
        px: 0.5,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        minHeight: 0,
        overflowY: 'auto',
      }}
    >
      {primary.map(renderNavButton)}
      {more.length > 0 ? (
        <>
          <EpisButton
            appearance="text"
            size="small"
            title={copy.dashboardMd3.navMore}
            onClick={onMoreToggle}
            aria-expanded={moreOpen}
          >
            {copy.dashboardMd3.navMore}
          </EpisButton>
          {moreOpen ? more.map(renderNavButton) : null}
        </>
      ) : null}
      <Typography variant="caption" color="text.secondary" sx={{ px: 0.5, mt: 1, display: 'none' }}>
        {primary.length}/{EPIS_DASHBOARD_NAV_MAX_VISIBLE}
      </Typography>
    </Stack>
  );
}
