import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import type { DashboardDetailSelection } from './EpisDashboardMd3MainGrid.js';

export type EpisDashboardMd3DetailPaneProps = {
  selection?: DashboardDetailSelection | null | undefined;
  collapsed?: boolean | undefined;
  onToggleCollapse?: (() => void) | undefined;
  onOpenClassic?: (() => void) | undefined;
  onOpenChart?: (() => void) | undefined;
  onCreateDraft?: (() => void) | undefined;
  testId?: string | undefined;
};

/** Detail pane — contexto sin reemplazar ficha clásica ni firmar. */
export function EpisDashboardMd3DetailPane({
  selection,
  collapsed = false,
  onToggleCollapse,
  onOpenClassic,
  onOpenChart,
  onCreateDraft,
  testId = 'epis2-dashboard-md3-detail-pane',
}: EpisDashboardMd3DetailPaneProps) {
  if (collapsed) {
    return (
      <Stack
        data-testid={testId}
        data-epis-detail-collapsed="true"
        sx={{ borderLeft: 1, borderColor: 'divider', p: 1, bgcolor: 'background.paper' }}
      >
        {onToggleCollapse ? (
          <EpisButton appearance="text" size="small" onClick={onToggleCollapse}>
            {copy.dashboardMd3.expandDetail}
          </EpisButton>
        ) : null}
      </Stack>
    );
  }

  return (
    <Stack
      data-testid={testId}
      spacing={1.5}
      sx={{
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        p: 1.5,
        minHeight: 0,
        overflow: 'auto',
        height: '100%',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">{copy.dashboardMd3.detailPaneTitle}</Typography>
        {onToggleCollapse ? (
          <EpisButton appearance="text" size="small" onClick={onToggleCollapse}>
            {copy.dashboardMd3.collapseDetail}
          </EpisButton>
        ) : null}
      </Stack>
      {selection ? (
        <>
          <Typography variant="body2" fontWeight={600}>
            {selection.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selection.summary}
          </Typography>
          <Stack spacing={0.5}>
            {onOpenChart ? (
              <EpisButton appearance="text" size="small" onClick={onOpenChart}>
                {copy.dashboardMd3.detailOpenChart}
              </EpisButton>
            ) : null}
            {onOpenClassic ? (
              <EpisButton appearance="text" size="small" onClick={onOpenClassic}>
                {copy.dashboardMd3.detailOpenClassic}
              </EpisButton>
            ) : null}
            {onCreateDraft ? (
              <EpisButton appearance="text" size="small" onClick={onCreateDraft}>
                {copy.dashboardMd3.detailCreateDraft}
              </EpisButton>
            ) : null}
          </Stack>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {copy.dashboardMd3.detailPaneEmpty}
        </Typography>
      )}
    </Stack>
  );
}
