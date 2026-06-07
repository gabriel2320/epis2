import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisWorkspaceSection, EpisDataGridSuspense, Stack, type GridColDef } from '@epis2/epis2-ui';
import { useMemo } from 'react';

export type QualityDashboardGridsProps = {
  data: QualityDashboardResponse;
};

export function QualityDashboardGrids({ data }: QualityDashboardGridsProps) {
  const auditColumns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'at',
        headerName: copy.interop.gridColumnAt,
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(String(value)).toLocaleString('es-CL') : '',
      },
      { field: 'eventType', headerName: copy.interop.gridColumnEvent, flex: 1, minWidth: 160 },
      {
        field: 'username',
        headerName: copy.interop.gridColumnUser,
        width: 140,
        valueGetter: (_value, row) => row.username ?? '—',
      },
      {
        field: 'entityType',
        headerName: copy.interop.gridColumnEntity,
        flex: 1,
        minWidth: 140,
        valueGetter: (_value, row) =>
          [row.entityType, row.entityId].filter(Boolean).join(' · ') || '—',
      },
    ],
    [],
  );

  const stagingColumns = useMemo<GridColDef[]>(
    () => [
      { field: 'batchLabel', headerName: copy.interop.gridColumnBatch, flex: 1, minWidth: 160 },
      { field: 'sourceSystem', headerName: copy.interop.gridColumnSource, width: 120 },
      { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 110 },
      { field: 'recordCount', headerName: copy.interop.gridColumnRecords, width: 100, type: 'number' },
      {
        field: 'stagedAt',
        headerName: copy.interop.gridColumnStagedAt,
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(String(value)).toLocaleString('es-CL') : '',
      },
    ],
    [],
  );

  return (
    <Stack spacing={2}>
      <EpisWorkspaceSection title={copy.interop.stagingTitle}>
        <EpisDataGridSuspense
          rows={data.stagingBatches}
          columns={stagingColumns}
          emptyMessage={copy.longitudinal.emptySection}
          hideFooter={data.stagingBatches.length <= 10}
          loadingLabel={copy.dashboard.gridLoading}
          data-testid="epis2-quality-staging-grid"
        />
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.interop.auditTitle}>
        <EpisDataGridSuspense
          rows={data.recentAudit}
          columns={auditColumns}
          emptyMessage={copy.longitudinal.emptySection}
          hideFooter={data.recentAudit.length <= 10}
          loadingLabel={copy.dashboard.gridLoading}
          data-testid="epis2-quality-audit-grid"
        />
      </EpisWorkspaceSection>
    </Stack>
  );
}
