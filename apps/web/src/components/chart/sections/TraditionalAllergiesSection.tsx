import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '@epis2/test-fixtures';
import { formatAllergyLine } from '../../clinical-summary/clinicalSummaryData.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

export type TraditionalAllergiesSectionProps = {
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  onRegisterAllergy?: (() => void) | undefined;
  testId?: string | undefined;
};

export function TraditionalAllergiesSection({
  demoCaseCode,
  longitudinal,
  onRegisterAllergy,
  testId = 'epis2-traditional-section-allergies',
}: TraditionalAllergiesSectionProps) {
  const fromLongitudinal =
    longitudinal?.allergies.map((a) => ({
      label: a.substance,
      value: formatAllergyLine(a),
    })) ?? [];
  const rows =
    fromLongitudinal.length > 0
      ? fromLongitudinal
      : getDemoChartSectionRows(demoCaseCode, 'navAllergies');

  return (
    <Stack spacing={1.5} data-testid={testId}>
      <TraditionalSectionDataTable rows={rows} testId={`${testId}-table`} />
      {onRegisterAllergy ? (
        <EpisButton appearance="text" size="small" onClick={onRegisterAllergy} sx={{ alignSelf: 'flex-start' }}>
          {copy.clinicalSummary.manageAllergies}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
