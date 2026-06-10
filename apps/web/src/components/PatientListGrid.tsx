import type { PatientListRow } from '../api/clinicalApi.js';
import { copy } from '@epis2/design-system';
import { ClinicalDataGrid, type ClinicalGridColDef } from '@epis2/clinical-productivity';
import { useMemo } from 'react';
import { getPrimaryNarrativeForDemoCode } from '../clinical/demoNarrativePresentation.js';

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
  const columns = useMemo<ClinicalGridColDef[]>(
    () => [
      {
        field: 'displayName',
        headerName: copy.dashboard.gridColumnPatient,
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'demoEpisode',
        headerName: copy.dashboard.gridColumnDemoEpisode,
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row) => {
          const code = row.demoCaseCode ?? row.demoLabel;
          if (!code) return '—';
          return getPrimaryNarrativeForDemoCode(code)?.titleEs ?? code;
        },
      },
      {
        field: 'demoCaseCode',
        headerName: copy.dashboard.gridColumnDemoCase,
        width: 110,
        valueGetter: (_value, row) => row.demoCaseCode ?? row.demoLabel ?? '—',
      },
    ],
    [],
  );

  return (
    <ClinicalDataGrid
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      hideFooter={rows.length <= 10}
      onRowClick={(row) => onSelectPatient(row.id)}
      {...(testId !== undefined ? { 'data-testid': testId } : {})}
    />
  );
}
