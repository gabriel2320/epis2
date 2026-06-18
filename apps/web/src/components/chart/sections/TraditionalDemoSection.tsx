import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import {
  getDemoChartDemoSectionRows,
  type DemoChartDemoSectionId,
} from '../../../fixtures/devFixturesBridge.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

const CICA_DEMO_MAX_ROWS = 5;

export type TraditionalDemoSectionProps = {
  demoCaseCode?: string | undefined;
  sectionId: DemoChartDemoSectionId;
  /** CICA — presupuesto 5 filas; sin mirror strip. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

/** Sección demo batch 2/3 — MF-TE-03 / MF-TE-04. */
export function TraditionalDemoSection({
  demoCaseCode,
  sectionId,
  compositionMode = 'default',
  testId,
}: TraditionalDemoSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const rows = getDemoChartDemoSectionRows(demoCaseCode, sectionId);
  const displayRows = cicaClassic ? rows.slice(0, CICA_DEMO_MAX_ROWS) : rows;
  const resolvedTestId =
    testId ?? `epis2-traditional-section-${sectionId.replace('nav', '').toLowerCase()}`;

  if (displayRows.length === 0) {
    return (
      <Stack
        data-testid={resolvedTestId}
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
      data-testid={resolvedTestId}
      {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}
    >
      <TraditionalSectionDataTable rows={displayRows} testId={`${resolvedTestId}-table`} />
    </Stack>
  );
}
