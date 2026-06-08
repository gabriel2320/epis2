import { ClinicalDataGrid, type ClinicalGridColDef } from '@epis2/clinical-productivity';
import type { EpisDataGridRow } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { useRadBulkSelection } from '../../design/useRadBulkSelection.js';
import {
  EpisBulkActionMenu,
  type EpisBulkActionMenuItem,
} from '../actions/EpisBulkActionMenu.js';

export type EpisRadSelectableGridProps = {
  rows: EpisDataGridRow[];
  columns: ClinicalGridColDef[];
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
  hideFooter?: boolean;
  onRowClick?: (row: EpisDataGridRow) => void;
  buildBulkActions: (selectedIds: readonly string[]) => EpisBulkActionMenuItem[];
  selectable?: boolean;
  height?: number;
  'data-testid'?: string;
};

/** Grid RAD con selección múltiple y menú masivo bajo demanda. */
export function EpisRadSelectableGrid({
  rows,
  columns,
  emptyMessage,
  loading,
  error,
  hideFooter,
  onRowClick,
  buildBulkActions,
  selectable = true,
  height,
  'data-testid': testId,
}: EpisRadSelectableGridProps) {
  const { selectedIds, selectedCount, setSelectedIds, clearSelection } = useRadBulkSelection();

  const actions = useMemo(
    () =>
      buildBulkActions(selectedIds).map((action) => ({
        ...action,
        onClick: () => {
          action.onClick();
          if (action.id !== 'copy-selection') clearSelection();
        },
      })),
    [buildBulkActions, clearSelection, selectedIds],
  );

  return (
    <>
      <EpisBulkActionMenu
        selectedCount={selectedCount}
        actions={actions}
        onClearSelection={clearSelection}
        testId={testId ? `${testId}-bulk` : 'epis2-rad-grid-bulk'}
      />
      <ClinicalDataGrid
        rows={rows}
        columns={columns}
        {...(emptyMessage ? { emptyMessage } : {})}
        {...(loading !== undefined ? { loading } : {})}
        {...(error ? { error } : {})}
        {...(hideFooter !== undefined ? { hideFooter } : {})}
        {...(onRowClick ? { onRowClick } : {})}
        {...(height !== undefined ? { height } : {})}
        {...(selectable
          ? {
              checkboxSelection: true,
              selectedRowIds: selectedIds,
              onSelectedRowIdsChange: setSelectedIds,
            }
          : {})}
        data-testid={testId}
      />
    </>
  );
}
