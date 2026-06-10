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
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import type { DashboardTab } from '../../routes/clinicalNavigate.js';
import type { DashboardNavDestination } from '../../dashboard-md3/dashboardNavDestinations.js';

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

export type EpisDashboardMd3MobileNavProps = {
  primary: readonly DashboardNavDestination[];
  more: readonly DashboardNavDestination[];
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  testId?: string;
};

/** Tabs horizontales dashboard — visible bajo md. */
export function EpisDashboardMd3MobileNav({
  primary,
  more,
  activeTab,
  onTabChange,
  testId = 'epis2-dashboard-md3-mobile-nav',
}: EpisDashboardMd3MobileNavProps) {
  const tabs = [...primary, ...more];

  return (
    <Stack
      direction="row"
      spacing={0.5}
      data-testid={testId}
      sx={{
        display: { xs: 'flex', md: 'none' },
        px: 1,
        py: 0.5,
        overflowX: 'auto',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      {tabs.map((dest) => (
        <EpisButton
          key={dest.id}
          appearance={dest.id === activeTab ? 'filled' : 'text'}
          size="small"
          title={dest.label}
          onClick={() => onTabChange(dest.id)}
          data-testid={`${testId}-${dest.id}`}
          startIcon={NAV_ICONS[dest.id] ?? <BoltIcon fontSize="small" />}
          sx={{ flexShrink: 0, minWidth: 0, px: 1 }}
        >
          {dest.label.slice(0, 10)}
        </EpisButton>
      ))}
    </Stack>
  );
}
