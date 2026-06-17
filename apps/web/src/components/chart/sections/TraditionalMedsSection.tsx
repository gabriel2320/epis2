import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { mapMarRowsToDenseTabular } from '@epis2/clinical-productivity';
import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '../../../fixtures/devFixturesBridge.js';
import {
  formatMedicationLine,
  partitionMedicationZones,
} from '../../clinical-summary/clinicalSummaryData.js';
import { TraditionalDenseSectionGrid } from './TraditionalDenseSectionGrid.js';

const CICA_MEDS_MAX_ROWS = 5;

export type TraditionalMedsSectionProps = {
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  /** CICA-L-07 — solo meds activas; máx. 5 filas. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

export function TraditionalMedsSection({
  demoCaseCode,
  longitudinal,
  compositionMode = 'default',
  testId = 'epis2-traditional-section-meds',
}: TraditionalMedsSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const meds = longitudinal?.medications ?? [];
  const zones = partitionMedicationZones(meds);
  const fromLongitudinal = cicaClassic
    ? zones.active.map((m) => ({ label: 'Activa', value: formatMedicationLine(m) }))
    : [
        ...zones.active.map((m) => ({ label: 'Activa', value: formatMedicationLine(m) })),
        ...zones.prn.map((m) => ({ label: 'PRN', value: formatMedicationLine(m) })),
        ...zones.suspended.map((m) => ({ label: 'Suspendida', value: formatMedicationLine(m) })),
      ];
  const rows =
    fromLongitudinal.length > 0
      ? fromLongitudinal
      : getDemoChartSectionRows(demoCaseCode, 'navMeds');
  const displayRows = cicaClassic ? rows.slice(0, CICA_MEDS_MAX_ROWS) : rows;
  const denseRows = mapMarRowsToDenseTabular(displayRows);

  if (denseRows.length === 0) {
    return (
      <Stack data-testid={testId} {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}>
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.longitudinal.emptySection}
        </EpisM3Text>
      </Stack>
    );
  }

  return (
    <Stack data-testid={testId} {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}>
      <TraditionalDenseSectionGrid rows={denseRows} variant="mar" testId={`${testId}-dense-grid`} />
    </Stack>
  );
}
