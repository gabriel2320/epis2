import type { PatientResultsInboxResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisTrendChartSuspense, EpisWorkspaceSection, Stack } from '@epis2/epis2-ui';
import { buildObservationTrend } from '../charts/observationTrend.js';

export type ResultsInboxTrendsProps = {
  inbox: Pick<PatientResultsInboxResponse, 'observations' | 'demoCaseCode'>;
};

export function ResultsInboxTrends({ inbox }: ResultsInboxTrendsProps) {
  const inrTrend = buildObservationTrend(inbox.observations, 'INR');
  const pcrTrend = buildObservationTrend(inbox.observations, 'PCR');
  const showInr = inbox.demoCaseCode === 'DEMO-005' || inrTrend.values.length >= 1;
  const showPcr = pcrTrend.values.length >= 1;

  if (!showInr && !showPcr) return null;

  return (
    <Stack spacing={2} data-testid="epis2-results-trends">
      {showInr ? (
        <EpisWorkspaceSection title={copy.results.trendInrTitle}>
          <EpisTrendChartSuspense
            xAxisLabels={inrTrend.xAxisLabels}
            series={[{ label: 'INR', data: inrTrend.values }]}
            emptyMessage={copy.charts.emptyTrend}
            loadingLabel={copy.charts.loading}
            data-testid="epis2-results-chart-inr"
          />
        </EpisWorkspaceSection>
      ) : null}
      {showPcr ? (
        <EpisWorkspaceSection title={copy.results.trendPcrTitle}>
          <EpisTrendChartSuspense
            xAxisLabels={pcrTrend.xAxisLabels}
            series={[{ label: 'PCR', data: pcrTrend.values }]}
            emptyMessage={copy.charts.emptyTrend}
            loadingLabel={copy.charts.loading}
            data-testid="epis2-results-chart-pcr"
          />
        </EpisWorkspaceSection>
      ) : null}
    </Stack>
  );
}
