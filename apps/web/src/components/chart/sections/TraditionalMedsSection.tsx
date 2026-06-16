import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { mapMarRowsToDenseTabular } from '@epis2/clinical-productivity';
import { Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '../../../fixtures/devFixturesBridge.js';
import {
  formatMedicationLine,
  partitionMedicationZones,
} from '../../clinical-summary/clinicalSummaryData.js';
import { TraditionalDenseSectionGrid } from './TraditionalDenseSectionGrid.js';

export type TraditionalMedsSectionProps = {
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  testId?: string | undefined;
};

export function TraditionalMedsSection({
  demoCaseCode,
  longitudinal,
  testId = 'epis2-traditional-section-meds',
}: TraditionalMedsSectionProps) {
  const meds = longitudinal?.medications ?? [];
  const zones = partitionMedicationZones(meds);
  const fromLongitudinal = [
    ...zones.active.map((m) => ({ label: 'Activa', value: formatMedicationLine(m) })),
    ...zones.prn.map((m) => ({ label: 'PRN', value: formatMedicationLine(m) })),
    ...zones.suspended.map((m) => ({ label: 'Suspendida', value: formatMedicationLine(m) })),
  ];
  const rows =
    fromLongitudinal.length > 0
      ? fromLongitudinal
      : getDemoChartSectionRows(demoCaseCode, 'navMeds');
  const denseRows = mapMarRowsToDenseTabular(rows);

  return (
    <Stack data-testid={testId}>
      <TraditionalDenseSectionGrid rows={denseRows} variant="mar" testId={`${testId}-dense-grid`} />
    </Stack>
  );
}
