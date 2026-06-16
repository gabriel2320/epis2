import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { getDemoChartSectionRows } from '../../../fixtures/devFixturesBridge.js';
import { Stack } from '@epis2/epis2-ui';
import {
  formatLabObservedAt,
  selectLabHighlights,
} from '../../clinical-summary/clinicalSummaryData.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

export type TraditionalLabsSectionProps = {
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  testId?: string | undefined;
};

export function TraditionalLabsSection({
  demoCaseCode,
  longitudinal,
  testId = 'epis2-traditional-section-labs',
}: TraditionalLabsSectionProps) {
  const obs = longitudinal?.observations ?? [];
  const fromLongitudinal = selectLabHighlights(obs, 8).map((o) => ({
    label: o.label,
    value: `${o.valueText} · ${formatLabObservedAt(o.observedAt)}`,
  }));
  const rows =
    fromLongitudinal.length > 0
      ? fromLongitudinal
      : getDemoChartSectionRows(demoCaseCode, 'navLabs');

  return (
    <Stack data-testid={testId}>
      <TraditionalSectionDataTable rows={rows} testId={`${testId}-table`} />
    </Stack>
  );
}
