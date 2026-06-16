import { Stack } from '@epis2/epis2-ui';
import {
  getDemoChartDemoSectionRows,
  type DemoChartDemoSectionId,
} from '../../../fixtures/devFixturesBridge.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

export type TraditionalDemoSectionProps = {
  demoCaseCode?: string | undefined;
  sectionId: DemoChartDemoSectionId;
  testId?: string | undefined;
};

/** Sección demo batch 2/3 — MF-TE-03 / MF-TE-04. */
export function TraditionalDemoSection({
  demoCaseCode,
  sectionId,
  testId,
}: TraditionalDemoSectionProps) {
  const rows = getDemoChartDemoSectionRows(demoCaseCode, sectionId);
  const resolvedTestId =
    testId ?? `epis2-traditional-section-${sectionId.replace('nav', '').toLowerCase()}`;

  return (
    <Stack data-testid={resolvedTestId}>
      <TraditionalSectionDataTable rows={rows} testId={`${resolvedTestId}-table`} />
    </Stack>
  );
}
