import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { getDemoChartDemoSectionRows } from '../../../fixtures/devFixturesBridge.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

const CICA_AUDIT_MAX_ROWS = 5;

export type TraditionalAuditSectionProps = {
  demoCaseCode?: string | undefined;
  /** CICA-L-11 — presupuesto 5 filas; trazabilidad demo en tab Más. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

/** MF-TE-03 — trazabilidad / auditoría demo (tab Más → navAudit). */
export function TraditionalAuditSection({
  demoCaseCode,
  compositionMode = 'default',
  testId = 'epis2-traditional-section-audit',
}: TraditionalAuditSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const rows = getDemoChartDemoSectionRows(demoCaseCode, 'navAudit');
  const displayRows = cicaClassic ? rows.slice(0, CICA_AUDIT_MAX_ROWS) : rows;

  if (displayRows.length === 0) {
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
      <TraditionalSectionDataTable rows={displayRows} testId={`${testId}-table`} />
    </Stack>
  );
}
