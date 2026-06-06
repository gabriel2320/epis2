import type { PatientResultsInboxResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisTrendChartSuspense, Paper, Stack } from '@epis2/epis2-ui';
import { buildObservationTrend } from '../charts/observationTrend.js';

export type ResultsInboxTrendsProps = {
  inbox: Pick<PatientResultsInboxResponse, 'observations' | 'demoCaseCode'>;
};

export function ResultsInboxTrends({ inbox }: ResultsInboxTrendsProps) {
  const inrTrend = buildObservationTrend(inbox.observations, 'INR');
  const pcrTrend = buildObservationTrend(inbox.observations, 'PCR');
  const showInr =
    inbox.demoCaseCode === 'DEMO-005' || inrTrend.values.length >= 1;
  const showPcr = pcrTrend.values.length >= 1;

  if (!showInr && !showPcr) return null;

  return (
    <Stack spacing={2} data-testid="epis2-results-trends">
      {showInr ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <EpisTrendChartSuspense
            title={copy.results.trendInrTitle}
            xAxisLabels={inrTrend.xAxisLabels}
            series={[{ label: 'INR', data: inrTrend.values }]}
            emptyMessage={copy.charts.emptyTrend}
            loadingLabel={copy.charts.loading}
            data-testid="epis2-results-chart-inr"
          />
        </Paper>
      ) : null}
      {showPcr ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <EpisTrendChartSuspense
            title={copy.results.trendPcrTitle}
            xAxisLabels={pcrTrend.xAxisLabels}
            series={[{ label: 'PCR', data: pcrTrend.values }]}
            emptyMessage={copy.charts.emptyTrend}
            loadingLabel={copy.charts.loading}
            data-testid="epis2-results-chart-pcr"
          />
        </Paper>
      ) : null}
    </Stack>
  );
}
