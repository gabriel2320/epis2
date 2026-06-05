import type { PatientListRow } from '../api/clinicalApi.js';
import { copy } from '@epis2/design-system';
import { EpisDataGridSuspense, type GridColDef } from '@epis2/epis2-ui';
import { useMemo } from 'react';

export type PatientListGridProps = {
  rows: PatientListRow[];
  emptyMessage: string;
  onSelectPatient: (patientId: string) => void;
  'data-testid'?: string;
};

export function PatientListGrid({
  rows,
  emptyMessage,
  onSelectPatient,
  'data-testid': testId,
}: PatientListGridProps) {
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'displayName',
        headerName: copy.dashboard.gridColumnPatient,
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'demoCaseCode',
        headerName: copy.dashboard.gridColumnDemoCase,
        width: 120,
        valueGetter: (_value, row) => row.demoCaseCode ?? row.demoLabel ?? '—',
      },
    ],
    [],
  );

  return (
    <EpisDataGridSuspense
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      hideFooter={rows.length <= 10}
      onRowClick={(row) => onSelectPatient(row.id)}
      data-testid={testId}
    />
  );
}
