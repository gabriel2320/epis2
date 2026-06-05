import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisTrendChartSuspense, Paper, Stack } from '@epis2/epis2-ui';
import { buildObservationTrend } from '../charts/observationTrend.js';

export type PatientClinicalChartsProps = {
  data: Pick<PatientLongitudinalResponse, 'observations' | 'demoCaseCode'>;
};

export function PatientClinicalCharts({ data }: PatientClinicalChartsProps) {
  const inrTrend = buildObservationTrend(data.observations, 'INR');
  const vitalsTrend = buildObservationTrend(data.observations, 'Frecuencia cardiaca');
  const showLab =
    data.demoCaseCode === 'DEMO-005' || inrTrend.values.length >= 2;
  const showVitals = vitalsTrend.values.length >= 2;

  if (!showLab && !showVitals) return null;

  return (
    <Stack spacing={2} data-testid="epis2-patient-clinical-charts">
      {showLab ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <EpisTrendChartSuspense
            title={copy.charts.labTrendTitle}
            xAxisLabels={inrTrend.xAxisLabels}
            series={[{ label: 'INR', data: inrTrend.values }]}
            emptyMessage={copy.charts.emptyTrend}
            loadingLabel={copy.charts.loading}
            data-testid="epis2-chart-inr-trend"
          />
        </Paper>
      ) : null}
      {showVitals ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <EpisTrendChartSuspense
            title={copy.charts.vitalsTrendTitle}
            xAxisLabels={vitalsTrend.xAxisLabels}
            series={[{ label: copy.charts.heartRateSeries, data: vitalsTrend.values }]}
            emptyMessage={copy.charts.emptyTrend}
            loadingLabel={copy.charts.loading}
            data-testid="epis2-chart-vitals-trend"
          />
        </Paper>
      ) : null}
    </Stack>
  );
}
