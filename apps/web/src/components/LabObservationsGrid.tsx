import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisDataGridSuspense, type GridColDef } from '@epis2/epis2-ui';
import { useMemo } from 'react';

export type LabObservationRow = PatientLongitudinalResponse['observations'][number] & {
  orderTitle?: string;
};

export type LabObservationsGridProps = {
  rows: LabObservationRow[];
  emptyMessage?: string;
  showOrderTrace?: boolean;
  'data-testid'?: string;
};

export function LabObservationsGrid({
  rows,
  emptyMessage = copy.longitudinal.emptySection,
  showOrderTrace = false,
  'data-testid': testId,
}: LabObservationsGridProps) {
  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'label', headerName: copy.longitudinal.gridColumnLabTest, flex: 1, minWidth: 140 },
      { field: 'valueText', headerName: copy.longitudinal.gridColumnLabValue, flex: 1, minWidth: 120 },
      ...(showOrderTrace
        ? [
            {
              field: 'orderTitle',
              headerName: copy.results.orderTrace,
              flex: 1,
              minWidth: 160,
              valueFormatter: (value: unknown) =>
                value ? String(value) : copy.results.orderTraceMissing,
            } satisfies GridColDef,
          ]
        : []),
      {
        field: 'observedAt',
        headerName: copy.longitudinal.gridColumnLabDate,
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(String(value)).toLocaleString('es-CL') : '',
      },
    ],
    [showOrderTrace],
  );

  return (
    <EpisDataGridSuspense
      rows={rows}
      columns={columns}
      emptyMessage={emptyMessage}
      hideFooter={rows.length <= 10}
      data-testid={testId}
    />
  );
}
