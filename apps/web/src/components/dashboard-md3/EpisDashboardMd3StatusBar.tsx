import { copy } from '@epis2/design-system';
import { Stack, Typography } from '@epis2/epis2-ui';

export type EpisDashboardMd3StatusBarProps = {
  lastUpdatedLabel?: string;
  dbStatus?: 'ok' | 'degraded';
  aiStatus?: 'ok' | 'degraded';
  activeFilterCount?: number;
  selectionCount?: number;
  userLabel?: string;
  roleLabel?: string;
  environmentLabel?: string;
  lastAuditLabel?: string;
  testId?: string;
};

/** Status bar sobria — sin botones clínicos principales. */
export function EpisDashboardMd3StatusBar({
  lastUpdatedLabel,
  dbStatus = 'ok',
  aiStatus = 'ok',
  activeFilterCount = 0,
  selectionCount = 0,
  userLabel,
  roleLabel,
  environmentLabel = 'demo',
  lastAuditLabel,
  testId = 'epis2-dashboard-md3-status-bar',
}: EpisDashboardMd3StatusBarProps) {
  return (
    <Stack
      data-testid={testId}
      direction="row"
      spacing={1.5}
      flexWrap="wrap"
      alignItems="center"
      useFlexGap
      sx={{
        minHeight: 32,
        maxHeight: 36,
        px: { xs: 1.5, md: 2 },
        py: 0.5,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption">{copy.dashboardMd3.statusMode}</Typography>
      {lastUpdatedLabel ? (
        <Typography variant="caption" color="text.secondary">
          {copy.dashboardMd3.statusUpdated}: {lastUpdatedLabel}
        </Typography>
      ) : null}
      <Typography
        variant="caption"
        color={dbStatus === 'ok' ? 'text.secondary' : 'warning.main'}
      >
        {dbStatus === 'ok' ? copy.dashboardMd3.dbOk : copy.dashboardMd3.dbDegraded}
      </Typography>
      <Typography
        variant="caption"
        color={aiStatus === 'ok' ? 'text.secondary' : 'warning.main'}
      >
        {aiStatus === 'ok' ? copy.dashboardMd3.aiOk : copy.dashboardMd3.aiDegraded}
      </Typography>
      {activeFilterCount > 0 ? (
        <Typography variant="caption" color="text.secondary">
          {copy.dashboardMd3.statusFilters}: {activeFilterCount}
        </Typography>
      ) : null}
      {selectionCount > 0 ? (
        <Typography variant="caption" color="text.secondary">
          {copy.dashboardMd3.statusSelection}: {selectionCount}
        </Typography>
      ) : null}
      {userLabel ? (
        <Typography variant="caption" color="text.secondary">
          {userLabel}
        </Typography>
      ) : null}
      {roleLabel ? (
        <Typography variant="caption" color="text.secondary">
          {roleLabel}
        </Typography>
      ) : null}
      <Typography variant="caption" color="text.secondary">
        {copy.dashboardMd3.statusEnvironment}: {environmentLabel}
      </Typography>
      {lastAuditLabel ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', lg: 'inline' } }}>
          {copy.dashboardMd3.statusLastAudit}: {lastAuditLabel}
        </Typography>
      ) : null}
    </Stack>
  );
}
