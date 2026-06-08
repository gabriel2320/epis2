import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import type { EpisDataGridRow } from '@epis2/epis2-ui';
import { useCallback } from 'react';
import type { EpisBulkActionMenuItem } from '../actions/EpisBulkActionMenu.js';
import { EpisRadSelectableGrid } from '../rad/EpisRadSelectableGrid.js';

export type DashboardHomogeneousGridProps = {
  rows: EpisDataGridRow[];
  columns: ClinicalGridColDef[];
  emptyMessage: string;
  onRowClick?: (row: EpisDataGridRow) => void;
  onCopySelection?: (lines: string[]) => void;
  extraBulkActions?: (selectedIds: readonly string[]) => EpisBulkActionMenuItem[];
  hideFooter?: boolean;
  selectable?: boolean;
  'data-testid'?: string;
};

/** Grilla compacta RAD para listas homogéneas del dashboard. */
export function DashboardHomogeneousGrid({
  rows,
  columns,
  emptyMessage,
  onRowClick,
  onCopySelection,
  extraBulkActions,
  hideFooter,
  selectable = true,
  'data-testid': testId,
}: DashboardHomogeneousGridProps) {
  const buildBulkActions = useCallback(
    (selectedIds: readonly string[]): EpisBulkActionMenuItem[] => {
      const base: EpisBulkActionMenuItem[] = onCopySelection
        ? [
            {
              id: 'copy-selection',
              label: copy.uiSimplify.bulkCopySelection,
              onClick: () => {
                const lines = selectedIds.map((id) => {
                  const row = rows.find((r) => r.id === id);
                  return row ? String(row.title ?? row.label ?? row.id) : id;
                });
                onCopySelection(lines);
              },
            },
          ]
        : [];
      return [...base, ...(extraBulkActions?.(selectedIds) ?? [])];
    },
    [extraBulkActions, onCopySelection, rows],
  );

  if (rows.length === 0) {
    return null;
  }

  return (
    <EpisRadSelectableGrid
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      buildBulkActions={buildBulkActions}
      {...(onRowClick ? { onRowClick } : {})}
      {...(hideFooter !== undefined ? { hideFooter } : {})}
      selectable={selectable}
      {...(testId ? { 'data-testid': testId } : {})}
    />
  );
}
