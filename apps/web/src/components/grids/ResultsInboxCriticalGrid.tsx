import type { PatientResultsInboxResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisChip } from '@epis2/epis2-ui';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import { EpisButton } from '@epis2/epis2-ui';
import { useCallback, useMemo } from 'react';
import type { EpisBulkActionMenuItem } from '../actions/EpisBulkActionMenu.js';
import { EpisRadSelectableGrid } from '../rad/EpisRadSelectableGrid.js';

export type ResultsInboxCriticalGridProps = {
  rows: PatientResultsInboxResponse['criticalResults'];
  ackingId: string | null;
  onAcknowledge: (criticalId: string) => void;
  onCopySelection: (labels: string[]) => void;
  'data-testid'?: string;
};

export function ResultsInboxCriticalGrid({
  rows,
  ackingId,
  onAcknowledge,
  onCopySelection,
  'data-testid': testId = 'epis2-results-critical-grid',
}: ResultsInboxCriticalGridProps) {
  const gridRows = useMemo(
    () =>
      rows.map((row) => ({
        id: row.id,
        label: row.label,
        valueText: row.valueText,
        severity: row.severity,
        observedAt: row.observedAt,
        acknowledged: row.acknowledged,
      })),
    [rows],
  );

  const columns = useMemo<ClinicalGridColDef[]>(
    () => [
      { field: 'label', headerName: 'Examen', flex: 1, minWidth: 120 },
      { field: 'valueText', headerName: 'Resultado', flex: 1, minWidth: 120 },
      {
        field: 'severity',
        headerName: 'Severidad',
        width: 100,
        renderCell: ({ value }) => (
          <EpisChip
            size="small"
            color={value === 'critical' ? 'error' : 'warning'}
            label={value === 'critical' ? 'Crítico' : 'Alto'}
          />
        ),
        sortable: false,
      },
      {
        field: 'acknowledged',
        headerName: 'Estado',
        width: 120,
        renderCell: ({ value }) => (
          <EpisChip
            size="small"
            variant="outlined"
            label={value ? copy.results.acknowledged : copy.results.pendingAck}
          />
        ),
        sortable: false,
      },
      {
        field: 'observedAt',
        headerName: copy.dashboard.gridColumnUpdated,
        width: 160,
        valueFormatter: (value) => (value ? new Date(String(value)).toLocaleString('es-CL') : ''),
      },
      {
        field: 'id',
        headerName: 'Acción',
        width: 130,
        sortable: false,
        renderCell: ({ row }) =>
          row.acknowledged ? null : (
            <EpisButton
              size="small"
              appearance="outlined"
              disabled={ackingId === row.id}
              onClick={(event) => {
                event.stopPropagation();
                onAcknowledge(String(row.id));
              }}
              data-testid={`epis2-results-ack-${row.id}`}
            >
              {copy.results.acknowledgeCritical}
            </EpisButton>
          ),
      },
    ],
    [ackingId, onAcknowledge],
  );

  const buildBulkActions = useCallback(
    (selectedIds: readonly string[]): EpisBulkActionMenuItem[] => {
      const pending = selectedIds.filter((id) => {
        const row = rows.find((r) => r.id === id);
        return row && !row.acknowledged;
      });
      return [
        {
          id: 'ack-selected',
          label: copy.uiSimplify.bulkMarkReviewed,
          requiresConfirmation: true,
          onClick: () => {
            for (const id of pending) onAcknowledge(id);
          },
        },
        {
          id: 'copy-selection',
          label: copy.uiSimplify.bulkCopySelection,
          onClick: () => {
            const labels = selectedIds.map((id) => {
              const row = rows.find((r) => r.id === id);
              return row ? `${row.label}: ${row.valueText}` : id;
            });
            onCopySelection(labels);
          },
        },
      ];
    },
    [onAcknowledge, onCopySelection, rows],
  );

  if (rows.length === 0) return null;

  return (
    <EpisRadSelectableGrid
      rows={gridRows}
      columns={columns}
      emptyMessage={copy.results.emptyCritical}
      buildBulkActions={buildBulkActions}
      hideFooter={rows.length <= 8}
      data-testid={testId}
    />
  );
}
