import { copy } from '@epis2/design-system';
import { EpisButton, EpisChip, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import type { DashboardScopeFilters } from '../../dashboard-md3/dashboardScopeFilters.js';
import { activeScopeFilterChips } from '../../dashboard-md3/dashboardScopeFilters.js';

export type EpisDashboardMd3ScopeBarProps = {
  filters: DashboardScopeFilters;
  onClearFilters?: () => void;
  testId?: string;
};

/** Scope bar — colapsada por defecto; expande filtros bajo demanda (UX P2). */
export function EpisDashboardMd3ScopeBar({
  filters,
  onClearFilters,
  testId = 'epis2-dashboard-md3-scope-bar',
}: EpisDashboardMd3ScopeBarProps) {
  const chips = activeScopeFilterChips(filters);
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack
      data-testid={testId}
      data-epis-scope-expanded={expanded ? 'true' : 'false'}
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
        minHeight: 40,
      }}
    >
      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
        {filters.service ?? copy.dashboardMd3.scopeService}
      </Typography>
      {expanded ? (
        <>
          {chips.map(({ key, label }) => (
            <EpisChip key={key} size="small" label={label} variant="outlined" />
          ))}
          {onClearFilters ? (
            <EpisButton appearance="text" size="small" onClick={onClearFilters}>
              {copy.dashboardMd3.clearFilters}
            </EpisButton>
          ) : null}
        </>
      ) : null}
      <EpisButton
        appearance="text"
        size="small"
        onClick={() => setExpanded((v) => !v)}
        data-testid={`${testId}-toggle`}
        sx={{ ml: expanded ? 0 : 'auto' }}
      >
        {expanded ? copy.dashboardMd3.scopeHideFilters : copy.dashboardMd3.scopeShowFilters}
      </EpisButton>
    </Stack>
  );
}
