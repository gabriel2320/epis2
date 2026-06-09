import { EpisChip, Stack, Typography } from '@epis2/epis2-ui';

export type DashboardKpiItem = {
  id: string;
  label: string;
  value: number | string;
  owner: string;
  onClick: () => void;
  testId?: string;
};

export type EpisDashboardMd3KpiStripProps = {
  items: readonly DashboardKpiItem[];
  testId?: string;
};

/** KPI strip — 4–6 indicadores accionables; cada uno abre grilla filtrada. */
export function EpisDashboardMd3KpiStrip({
  items,
  testId = 'epis2-dashboard-md3-kpi-strip',
}: EpisDashboardMd3KpiStripProps) {
  const visible = items.filter((item) => typeof item.onClick === 'function').slice(0, 6);

  if (visible.length === 0) return null;

  return (
    <Stack
      data-testid={testId}
      direction="row"
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      sx={{
        px: { xs: 1.5, md: 2 },
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
        overflowX: 'auto',
      }}
    >
      {visible.map((item) => (
        <EpisChip
          key={item.id}
          clickable
          variant="outlined"
          onClick={item.onClick}
          data-testid={item.testId ?? `${testId}-${item.id}`}
          data-epis-kpi-owner={item.owner}
          label={
            <Stack direction="row" spacing={0.5} alignItems="baseline">
              <Typography variant="caption" component="span">
                {item.label}
              </Typography>
              <Typography variant="subtitle2" component="span" fontWeight={700}>
                {item.value}
              </Typography>
            </Stack>
          }
        />
      ))}
    </Stack>
  );
}
