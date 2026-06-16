import { mapLabelValueRowsToDenseTabular } from '@epis2/clinical-productivity';
import { Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '../../../fixtures/devFixturesBridge.js';
import { TraditionalDenseSectionGrid } from './TraditionalDenseSectionGrid.js';

export type TraditionalOrdersSectionProps = {
  demoCaseCode?: string | undefined;
  testId?: string | undefined;
};

export function TraditionalOrdersSection({
  demoCaseCode,
  testId = 'epis2-traditional-section-orders',
}: TraditionalOrdersSectionProps) {
  const rows = getDemoChartSectionRows(demoCaseCode, 'navOrders');
  const denseRows = mapLabelValueRowsToDenseTabular(rows, 'Programada');

  return (
    <Stack data-testid={testId}>
      <TraditionalDenseSectionGrid
        rows={denseRows}
        variant="orders"
        testId={`${testId}-dense-grid`}
      />
    </Stack>
  );
}
