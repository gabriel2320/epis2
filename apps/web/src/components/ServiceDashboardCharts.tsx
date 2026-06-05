import type { ServiceDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisTrendChartSuspense, Paper } from '@epis2/epis2-ui';
import { buildServiceKpiChart } from '../charts/serviceKpis.js';

export type ServiceDashboardChartsProps = {
  data: ServiceDashboardResponse;
};

export function ServiceDashboardCharts({ data }: ServiceDashboardChartsProps) {
  const kpi = buildServiceKpiChart(data);

  return (
    <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-service-kpi-chart">
      <EpisTrendChartSuspense
        title={copy.charts.serviceKpiTitle}
        variant="bar"
        xAxisLabels={kpi.xAxisLabels}
        series={kpi.series}
        emptyMessage={copy.charts.emptyTrend}
        loadingLabel={copy.charts.loading}
        data-testid="epis2-chart-service-kpi"
      />
    </Paper>
  );
}
