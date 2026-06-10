import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import type { EpisDataGridRow } from '@epis2/epis2-ui';
import { EpisWorkspaceSection, Typography } from '@epis2/epis2-ui';
import { DashboardHomogeneousGrid } from './DashboardHomogeneousGrid.js';
import { copyLinesToClipboard } from './radBulkActions.js';

const titleColumn: ClinicalGridColDef = {
  field: 'title',
  headerName: copy.dashboard.gridColumnTitle,
  flex: 1,
  minWidth: 140,
};

const detailColumn: ClinicalGridColDef = {
  field: 'detail',
  headerName: copy.dashboard.gridColumnStatus,
  flex: 1,
  minWidth: 160,
};

export type DashboardPanelGridSectionProps = {
  title: string;
  testId: string;
  rows: EpisDataGridRow[];
  onRowClick?: (row: EpisDataGridRow) => void;
  emptyFallback?: string;
  selectable?: boolean;
  titleHeader?: string;
};

/** Sección dashboard: título + grilla homogénea title/detail. */
export function DashboardPanelGridSection({
  title,
  testId,
  rows,
  onRowClick,
  emptyFallback,
  selectable,
  titleHeader,
}: DashboardPanelGridSectionProps) {
  const message = emptyFallback ?? copy.longitudinal.emptySection;
  const columns: ClinicalGridColDef[] = titleHeader
    ? [{ ...titleColumn, headerName: titleHeader }, detailColumn]
    : [titleColumn, detailColumn];

  return (
    <EpisWorkspaceSection title={title} testId={testId}>
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      ) : (
        <DashboardHomogeneousGrid
          rows={rows}
          columns={columns}
          emptyMessage={message}
          selectable={selectable ?? rows.length > 1}
          onCopySelection={copyLinesToClipboard}
          {...(onRowClick ? { onRowClick } : {})}
          data-testid={`${testId}-grid`}
        />
      )}
    </EpisWorkspaceSection>
  );
}
