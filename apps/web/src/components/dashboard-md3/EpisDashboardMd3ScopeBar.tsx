import { copy } from '@epis2/design-system';
import { EpisButton, EpisChip, Stack, Typography } from '@epis2/epis2-ui';
import type { DashboardScopeFilters } from '../../dashboard-md3/dashboardScopeFilters.js';
import { activeScopeFilterChips } from '../../dashboard-md3/dashboardScopeFilters.js';

export type EpisDashboardMd3ScopeBarProps = {
  filters: DashboardScopeFilters;
  onClearFilters?: () => void;
  testId?: string;
};

/** Scope bar fija — filtros operacionales siempre visibles (máx. 2 líneas). */
export function EpisDashboardMd3ScopeBar({
  filters,
  onClearFilters,
  testId = 'epis2-dashboard-md3-scope-bar',
}: EpisDashboardMd3ScopeBarProps) {
  const chips = activeScopeFilterChips(filters);

  return (
    <Stack
      data-testid={testId}
      direction="row"
      spacing={1}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{
        px: { xs: 1.5, md: 2 },
        py: 0.75,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        maxHeight: 72,
        overflow: 'hidden',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
        {copy.dashboardMd3.scopeService}:
      </Typography>
      {chips.map(({ key, label }) => (
        <EpisChip key={key} size="small" label={label} variant="outlined" />
      ))}
      {onClearFilters ? (
        <EpisButton appearance="text" size="small" onClick={onClearFilters}>
          {copy.dashboardMd3.clearFilters}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
