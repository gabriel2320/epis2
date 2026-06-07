import type { ServiceDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisTrendChartSuspense, EpisWorkspaceSection } from '@epis2/epis2-ui';
import { buildServiceKpiChart } from '../charts/serviceKpis.js';

export type ServiceDashboardChartsProps = {
  data: ServiceDashboardResponse;
};

export function ServiceDashboardCharts({ data }: ServiceDashboardChartsProps) {
  const kpi = buildServiceKpiChart(data);

  return (
    <EpisWorkspaceSection title={copy.charts.serviceKpiTitle} testId="epis2-service-kpi-chart">
      <EpisTrendChartSuspense
        variant="bar"
        xAxisLabels={kpi.xAxisLabels}
        series={kpi.series}
        emptyMessage={copy.charts.emptyTrend}
        loadingLabel={copy.charts.loading}
        data-testid="epis2-chart-service-kpi"
      />
    </EpisWorkspaceSection>
  );
}
