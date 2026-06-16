import { copy } from '@epis2/design-system';
import { EpisM3Text, Stack } from '@epis2/epis2-ui';
import { getDemoChartDemoSectionRows } from '../../../fixtures/devFixturesBridge.js';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

const CICA_DOCUMENTS_MAX_ROWS = 5;

export type TraditionalDocumentsSectionProps = {
  demoCaseCode?: string | undefined;
  /** CICA-L-08 — presupuesto 5 filas; solo navDocuments en tab Documentos. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

/** MF-TE-03 — documentos clínicos demo (tab Documentos). */
export function TraditionalDocumentsSection({
  demoCaseCode,
  compositionMode = 'default',
  testId = 'epis2-traditional-section-documents',
}: TraditionalDocumentsSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const rows = getDemoChartDemoSectionRows(demoCaseCode, 'navDocuments');
  const displayRows = cicaClassic ? rows.slice(0, CICA_DOCUMENTS_MAX_ROWS) : rows;

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
