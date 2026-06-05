import type { DashboardWorkResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  EpisDataGrid,
  EpisDraftStatus,
  type GridColDef,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';

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
  showPatientColumn = true,
  showUpdatedColumn = true,
  'data-testid': testId,
}: WorklistDraftGridProps) {
  const columns = useMemo<GridColDef[]>(() => {
    const cols: GridColDef[] = [
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

  return (
    <EpisDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      hideFooter={rows.length <= 10}
      onRowClick={(row) => onOpenDraft(row.id)}
      data-testid={testId}
    />
  );
}
