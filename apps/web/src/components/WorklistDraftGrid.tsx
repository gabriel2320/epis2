import type { DashboardWorkResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisDraftStatus } from '@epis2/epis2-ui';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import type { EpisDataGridRow } from '@epis2/epis2-ui';
import { useCallback, useMemo } from 'react';
import type { EpisBulkActionMenuItem } from './actions/EpisBulkActionMenu.js';
import { EpisRadSelectableGrid } from './rad/EpisRadSelectableGrid.js';

export type DraftWorklistRow = DashboardWorkResponse['myOpenDrafts'][number];

export type DraftWorklistGridRow = {
  id: string;
  title: string;
  status: string;
  draftType: string;
  patientDisplayName?: string;
  updatedAt?: string;
};

export type WorklistDraftGridProps = {
  rows: DraftWorklistGridRow[];
  loading?: boolean;
  error?: string;
  emptyMessage: string;
  onOpenDraft: (draftId: string) => void;
  onCopySelection?: (lines: string[]) => void;
  showPatientColumn?: boolean;
  showUpdatedColumn?: boolean;
  'data-testid'?: string;
};

export function WorklistDraftGrid({
  rows,
  loading,
  error,
  emptyMessage,
  onOpenDraft,
  onCopySelection,
  showPatientColumn = true,
  showUpdatedColumn = true,
  'data-testid': testId,
}: WorklistDraftGridProps) {
  const columns = useMemo<ClinicalGridColDef[]>(() => {
    const cols: ClinicalGridColDef[] = [
      {
        field: 'title',
        headerName: copy.dashboard.gridColumnTitle,
        flex: 1,
        minWidth: 160,
      },
    ];
    if (showPatientColumn) {
      cols.push({
        field: 'patientDisplayName',
        headerName: copy.dashboard.gridColumnPatient,
        flex: 1,
        minWidth: 140,
      });
    }
    cols.push(
      {
        field: 'draftType',
        headerName: copy.dashboard.gridColumnType,
        width: 140,
      },
      {
        field: 'status',
        headerName: copy.dashboard.gridColumnStatus,
        width: 160,
        renderCell: ({ value }) => <EpisDraftStatus status={String(value ?? '')} />,
        sortable: false,
      },
    );
    if (showUpdatedColumn) {
      cols.push({
        field: 'updatedAt',
        headerName: copy.dashboard.gridColumnUpdated,
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(String(value)).toLocaleString('es-CL') : '',
      });
    }
    return cols;
  }, [showPatientColumn, showUpdatedColumn]);

  const buildBulkActions = useCallback(
    (selectedIds: readonly string[]): EpisBulkActionMenuItem[] => {
      const actions: EpisBulkActionMenuItem[] = [];
      if (onCopySelection) {
        actions.push({
          id: 'copy-selection',
          label: copy.uiSimplify.bulkCopySelection,
          onClick: () => {
            const lines = selectedIds.map((id) => {
              const row = rows.find((r) => r.id === id);
              return row?.title ?? id;
            });
            onCopySelection(lines);
          },
        });
      }
      if (selectedIds.length === 1) {
        actions.push({
          id: 'open-draft',
          label: copy.dashboard.gridColumnTitle,
          onClick: () => onOpenDraft(selectedIds[0]!),
        });
      }
      return actions;
    },
    [onCopySelection, onOpenDraft, rows],
  );

  return (
    <EpisRadSelectableGrid
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      {...(loading !== undefined ? { loading } : {})}
      {...(error ? { error } : {})}
      onRowClick={(row: EpisDataGridRow) => onOpenDraft(row.id)}
      buildBulkActions={buildBulkActions}
      hideFooter={rows.length <= 10}
      data-testid={testId}
    />
  );
}
