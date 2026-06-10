import type { PatientResultsInboxResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import { useCallback, useMemo } from 'react';
import type { EpisBulkActionMenuItem } from '../actions/EpisBulkActionMenu.js';
import { EpisRadSelectableGrid } from '../rad/EpisRadSelectableGrid.js';

function orderTypeLabel(orderType: string) {
  if (orderType === 'lab') return copy.results.orderTypeLab;
  if (orderType === 'imaging') return copy.results.orderTypeImaging;
  return orderType;
}

export type ResultsInboxPendingOrdersGridProps = {
  rows: PatientResultsInboxResponse['pendingOrders'];
  onCopySelection: (lines: string[]) => void;
  'data-testid'?: string;
};

export function ResultsInboxPendingOrdersGrid({
  rows,
  onCopySelection,
  'data-testid': testId = 'epis2-results-pending-orders-grid',
}: ResultsInboxPendingOrdersGridProps) {
  const gridRows = useMemo(
    () =>
      rows.map((order) => ({
        id: order.id,
        title: order.title,
        orderType: order.orderType,
        priority: order.priority,
        orderedAt: order.orderedAt,
      })),
    [rows],
  );

  const columns = useMemo<ClinicalGridColDef[]>(
    () => [
      { field: 'title', headerName: copy.dashboard.gridColumnTitle, flex: 1, minWidth: 180 },
      {
        field: 'orderType',
        headerName: copy.dashboard.gridColumnType,
        width: 120,
        valueFormatter: (value) => orderTypeLabel(String(value ?? '')),
      },
      { field: 'priority', headerName: 'Prioridad', width: 100 },
      {
        field: 'orderedAt',
        headerName: copy.dashboard.gridColumnUpdated,
        width: 170,
        valueFormatter: (value) => (value ? new Date(String(value)).toLocaleString('es-CL') : ''),
      },
    ],
    [],
  );

  const buildBulkActions = useCallback(
    (selectedIds: readonly string[]): EpisBulkActionMenuItem[] => [
      {
        id: 'copy-selection',
        label: copy.uiSimplify.bulkCopySelection,
        onClick: () => {
          const lines = selectedIds.map((id) => {
            const row = rows.find((r) => r.id === id);
            return row ? `${row.title} · ${orderTypeLabel(row.orderType)} · ${row.priority}` : id;
          });
          onCopySelection(lines);
        },
      },
      {
        id: 'mark-reviewed',
        label: copy.uiSimplify.bulkMarkReviewed,
        onClick: () => {
          /* borrador operativo — sin persistencia en Fase A */
        },
      },
    ],
    [onCopySelection, rows],
  );

  if (rows.length === 0) return null;

  return (
    <EpisRadSelectableGrid
      rows={gridRows}
      columns={columns}
      emptyMessage={copy.results.emptyPendingOrders}
      buildBulkActions={buildBulkActions}
      hideFooter={rows.length <= 8}
      data-testid={testId}
    />
  );
}
