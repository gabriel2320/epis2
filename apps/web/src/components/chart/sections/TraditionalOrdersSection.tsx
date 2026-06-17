import { mapLabelValueRowsToDenseTabular } from '@epis2/clinical-productivity';
import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '../../../fixtures/devFixturesBridge.js';
import { TraditionalDenseSectionGrid } from './TraditionalDenseSectionGrid.js';

export type TraditionalOrdersSectionProps = {
  demoCaseCode?: string | undefined;
  /** CICA-L-05 — grid limpio sin mirror strip. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

export function TraditionalOrdersSection({
  demoCaseCode,
  compositionMode = 'default',
  testId = 'epis2-traditional-section-orders',
}: TraditionalOrdersSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const rows = getDemoChartSectionRows(demoCaseCode, 'navOrders');
  const denseRows = mapLabelValueRowsToDenseTabular(rows, 'Programada');

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
      <TraditionalDenseSectionGrid
        rows={denseRows}
        variant="orders"
        testId={`${testId}-dense-grid`}
      />
    </Stack>
  );
}
