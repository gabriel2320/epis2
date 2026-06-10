import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
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
      {primary.map((dest) => {
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
              minHeight: 56,
              fontSize: '0.65rem',
              lineHeight: 1.2,
              px: 0.5,
            }}
          >
            {dest.label.slice(0, 8)}
          </EpisButton>
        );
      })}
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
          {moreOpen
            ? more.map((dest) => (
                <EpisButton
                  key={dest.id}
                  appearance={dest.id === activeTab ? 'filled' : 'text'}
                  size="small"
                  title={dest.label}
                  onClick={() => onTabChange(dest.id)}
                  data-testid={dest.testId}
                  sx={{ fontSize: '0.65rem' }}
                >
                  {dest.label.slice(0, 10)}
                </EpisButton>
              ))
            : null}
        </>
      ) : null}
      <Typography variant="caption" color="text.secondary" sx={{ px: 0.5, mt: 1, display: 'none' }}>
        {primary.length}/{EPIS_DASHBOARD_NAV_MAX_VISIBLE}
      </Typography>
    </Stack>
  );
}
