import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '../../../fixtures/devFixturesBridge.js';
import {
  formatLabObservedAt,
  selectLabHighlights,
} from '../../clinical-summary/clinicalSummaryData.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

const CICA_LABS_MAX_ROWS = 5;

export type TraditionalLabsSectionProps = {
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  /** CICA-L-06 — presupuesto 5 filas; sin subnav imagen en tab Exámenes. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

export function TraditionalLabsSection({
  demoCaseCode,
  longitudinal,
  compositionMode = 'default',
  testId = 'epis2-traditional-section-labs',
}: TraditionalLabsSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const highlightLimit = cicaClassic ? CICA_LABS_MAX_ROWS : 8;
  const obs = longitudinal?.observations ?? [];
  const fromLongitudinal = selectLabHighlights(obs, highlightLimit).map((o) => ({
    label: o.label,
    value: `${o.valueText} · ${formatLabObservedAt(o.observedAt)}`,
  }));
  const rows =
    fromLongitudinal.length > 0
      ? fromLongitudinal
      : getDemoChartSectionRows(demoCaseCode, 'navLabs');
  const displayRows = cicaClassic ? rows.slice(0, CICA_LABS_MAX_ROWS) : rows;

  if (displayRows.length === 0) {
    return (
      <Stack
        data-testid={testId}
        {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}
      >
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.longitudinal.emptySection}
        </EpisM3Text>
      </Stack>
    );
  }

  return (
    <Stack
      data-testid={testId}
      {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}
    >
      <TraditionalSectionDataTable rows={displayRows} testId={`${testId}-table`} />
    </Stack>
  );
}
