import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';

export type EpisDashboardMd3StatusBarProps = {
  lastUpdatedLabel?: string | undefined;
  dbStatus?: 'ok' | 'degraded' | undefined;
  aiStatus?: 'ok' | 'degraded' | undefined;
  activeFilterCount?: number | undefined;
  selectionCount?: number | undefined;
  userLabel?: string | undefined;
  roleLabel?: string | undefined;
  environmentLabel?: string | undefined;
  lastAuditLabel?: string | undefined;
  testId?: string | undefined;
  embedded?: boolean | undefined;
};

/** Status bar sobria — resumen + detalle expandible (UX P2). */
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
  embedded = false,
}: EpisDashboardMd3StatusBarProps) {
  const [expanded, setExpanded] = useState(false);

  const headline = [
    copy.dashboardMd3.statusMode,
    lastUpdatedLabel ? `${copy.dashboardMd3.statusUpdated}: ${lastUpdatedLabel}` : undefined,
    selectionCount > 0 ? `${copy.dashboardMd3.statusSelection}: ${selectionCount}` : undefined,
  ].filter(Boolean) as string[];

  const detail = [
    dbStatus === 'ok' ? copy.dashboardMd3.dbOk : copy.dashboardMd3.dbDegraded,
    aiStatus === 'ok' ? copy.dashboardMd3.aiOk : copy.dashboardMd3.aiDegraded,
    activeFilterCount > 0 ? `${copy.dashboardMd3.statusFilters}: ${activeFilterCount}` : undefined,
    userLabel,
    roleLabel,
    `${copy.dashboardMd3.statusEnvironment}: ${environmentLabel}`,
    lastAuditLabel ? `${copy.dashboardMd3.statusLastAudit}: ${lastAuditLabel}` : undefined,
  ].filter(Boolean) as string[];

  return (
    <Stack
      data-testid={testId}
      direction="row"
      spacing={1}
      flexWrap="wrap"
      alignItems="center"
      useFlexGap
      sx={{
        minHeight: 28,
        px: { xs: 1.5, md: 2 },
        py: 0.5,
        ...(embedded ? {} : { borderTop: 1, borderColor: 'divider' }),
        bgcolor: embedded ? 'transparent' : 'background.paper',
      }}
    >
      {headline.map((part) => (
        <Typography key={part} variant="caption" color="text.primary" fontWeight={600}>
          {part}
        </Typography>
      ))}
      {expanded
        ? detail.map((part) => (
            <Typography key={part} variant="caption" color="text.secondary">
              {part}
            </Typography>
          ))
        : null}
      {detail.length > 0 ? (
        <EpisButton
          appearance="text"
          size="small"
          onClick={() => setExpanded((v) => !v)}
          data-testid={`${testId}-toggle`}
          sx={{ minWidth: 0, px: 0.75, ml: 'auto' }}
        >
          {expanded ? copy.layout.statusShowLess : copy.layout.statusShowMore}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
