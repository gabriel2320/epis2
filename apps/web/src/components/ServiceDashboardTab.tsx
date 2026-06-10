import type { ServiceDashboardResponse } from '@epis2/contracts';
import { lazy, Suspense, useMemo, useState } from 'react';
import { copy } from '@epis2/design-system';
import {
  acknowledgeCriticalResult,
  createInpatientAdmission,
  dischargeInpatientAdmission,
  transferInpatientAdmission,
} from '../api/dashboardApi.js';
import {
  Alert,
  Box,
  Button,
  EpisLoadingState,
  EpisMetric,
  EpisWorkspaceSection,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';

const LazyServiceDashboardCharts = lazy(() =>
  import('./ServiceDashboardCharts.js').then((m) => ({
    default: m.ServiceDashboardCharts,
  })),
);

export type ServiceDashboardTabProps = {
  data: ServiceDashboardResponse;
  activePatientId?: string | undefined;
  onOpenPatient: (patientId: string) => void;
  onOpenEpicrisis?: ((patientId: string) => void) | undefined;
  onReload: () => void;
};

export function ServiceDashboardTab({
  data,
  activePatientId,
  onOpenPatient,
  onOpenEpicrisis,
  onReload,
}: ServiceDashboardTabProps) {
  const [ackingId, setAckingId] = useState<string | null>(null);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const availableBeds = useMemo(
    () => data.census.filter((b) => b.status === 'available'),
    [data.census],
  );
  const occupiedBeds = useMemo(
    () => data.census.filter((b) => b.status === 'occupied').length,
    [data.census],
  );

  const censusRows = useMemo(
    () =>
      data.census.map((bed) => ({
        id: bed.bedId,
        bedLabel: bed.bedLabel,
        statusLabel:
          bed.status === 'occupied'
            ? (bed.patientDisplayName ?? copy.inpatient.occupied)
            : copy.inpatient.available,
        demoCaseCode: bed.demoCaseCode ?? '—',
        patientId: bed.patientId ?? '',
        admissionId: bed.admissionId ?? '',
      })),
    [data.census],
  );

  const censusColumns = useMemo<ClinicalGridColDef[]>(
    () => [
      { field: 'bedLabel', headerName: copy.inpatient.census, flex: 1, minWidth: 120 },
      {
        field: 'statusLabel',
        headerName: copy.dashboard.gridColumnPatient,
        flex: 1,
        minWidth: 160,
      },
      { field: 'demoCaseCode', headerName: copy.dashboard.gridColumnDemoCase, width: 110 },
    ],
    [],
  );

  const orderRows = useMemo(
    () =>
      data.activeOrders.map((o) => ({
        id: o.id,
        title: `${o.patientDisplayName} — ${o.title}`,
        orderType: o.orderType,
        priority: o.priority,
        patientId: o.patientId,
      })),
    [data.activeOrders],
  );

  const handleAck = async (criticalId: string) => {
    setAckingId(criticalId);
    try {
      await acknowledgeCriticalResult(criticalId);
      onReload();
    } finally {
      setAckingId(null);
    }
  };

  const handleAdmit = async () => {
    if (!activePatientId || !selectedBedId) return;
    setStatusMsg(null);
    try {
      await createInpatientAdmission({
        patientId: activePatientId,
        bedId: selectedBedId,
        unitCode: data.unitCode,
      });
      setStatusMsg(copy.inpatient.admitSuccess);
      onReload();
    } catch {
      setStatusMsg(copy.errors.genericMessage);
    }
  };

  const handleDischarge = async (admissionId: string, patientId?: string) => {
    setStatusMsg(null);
    try {
      await dischargeInpatientAdmission(admissionId);
      setStatusMsg(copy.inpatient.dischargeSuccess);
      onReload();
      if (patientId && onOpenEpicrisis) onOpenEpicrisis(patientId);
    } catch {
      setStatusMsg(copy.errors.genericMessage);
    }
  };

  const handleTransfer = async (admissionId: string, targetBedId: string) => {
    setStatusMsg(null);
    try {
      await transferInpatientAdmission(admissionId, targetBedId);
      setStatusMsg(copy.inpatient.transferSuccess);
      onReload();
    } catch {
      setStatusMsg(copy.errors.genericMessage);
    }
  };

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-service-rad">
      <Stack spacing={2} data-testid="epis2-dashboard-service">
        <Box>
          <Typography variant="h6">{data.unitName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {data.unitCode} · {copy.demoBadge}
          </Typography>
        </Box>

        {statusMsg ? <Alert severity="info">{statusMsg}</Alert> : null}

        {activePatientId && availableBeds.length > 0 ? (
          <EpisWorkspaceSection title={copy.inpatient.admitTitle} testId="epis2-inpatient-admit">
            <Stack direction="row" spacing={1} alignItems="center">
              <Select
                size="small"
                displayEmpty
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(String(e.target.value))}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">{copy.inpatient.selectBed}</MenuItem>
                {availableBeds.map((b) => (
                  <MenuItem key={b.bedId} value={b.bedId}>
                    {b.bedLabel}
                  </MenuItem>
                ))}
              </Select>
              <Button
                size="small"
                variant="outlined"
                onClick={() => void handleAdmit()}
                data-testid="epis2-inpatient-admit-submit"
              >
                {copy.inpatient.admitSubmit}
              </Button>
            </Stack>
          </EpisWorkspaceSection>
        ) : null}

        <Suspense fallback={<EpisLoadingState label={copy.charts.loading} />}>
          <LazyServiceDashboardCharts data={data} />
        </Suspense>

        <EpisWorkspaceSection title={copy.inpatient.census} testId="epis2-service-census">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
            <EpisMetric
              label={copy.inpatient.censusOccupied}
              value={String(occupiedBeds)}
              data-testid="epis2-service-census-occupied"
            />
            <EpisMetric
              label={copy.inpatient.censusAvailable}
              value={String(availableBeds.length)}
              data-testid="epis2-service-census-available"
            />
          </Stack>
          <DashboardHomogeneousGrid
            rows={censusRows}
            columns={censusColumns}
            emptyMessage={copy.longitudinal.emptySection}
            onRowClick={(row) => {
              if (row.patientId) onOpenPatient(String(row.patientId));
            }}
            extraBulkActions={(selectedIds) => {
              const row = censusRows.find((r) => r.id === selectedIds[0]);
              if (!row?.admissionId || selectedIds.length !== 1) return [];
              return [
                {
                  id: 'prepare-discharge',
                  label: copy.inpatient.prepareDischarge,
                  onClick: () => row.patientId && onOpenEpicrisis?.(String(row.patientId)),
                },
                {
                  id: 'discharge',
                  label: copy.inpatient.dischargePatient,
                  requiresConfirmation: true,
                  onClick: () =>
                    void handleDischarge(String(row.admissionId), String(row.patientId || '')),
                },
                ...(availableBeds.length > 0
                  ? [
                      {
                        id: 'transfer',
                        label: copy.inpatient.transferBed,
                        onClick: () => {
                          const target = availableBeds[0]?.bedId;
                          if (target) void handleTransfer(String(row.admissionId), target);
                        },
                      },
                    ]
                  : []),
              ];
            }}
            data-testid="epis2-service-census-grid"
          />
        </EpisWorkspaceSection>

        {data.activeOrders.length > 0 ? (
          <EpisWorkspaceSection title={copy.inpatient.activeOrders}>
            <DashboardHomogeneousGrid
              rows={orderRows}
              columns={[
                {
                  field: 'title',
                  headerName: copy.dashboard.gridColumnTitle,
                  flex: 1,
                  minWidth: 200,
                },
                { field: 'orderType', headerName: copy.dashboard.gridColumnType, width: 120 },
                { field: 'priority', headerName: 'Prioridad', width: 100 },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              onRowClick={(row) => onOpenPatient(String(row.patientId))}
              data-testid="epis2-service-orders-grid"
            />
          </EpisWorkspaceSection>
        ) : null}

        <EpisWorkspaceSection title={copy.inpatient.criticalUnacked}>
          {data.unacknowledgedCriticals.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.inpatient.noCriticals}
            </Typography>
          ) : (
            <DashboardHomogeneousGrid
              rows={data.unacknowledgedCriticals.map((c) => ({
                id: c.id,
                title: `${c.patientDisplayName} — ${c.label}: ${c.valueText}`,
                severity: c.severity,
              }))}
              columns={[
                {
                  field: 'title',
                  headerName: copy.results.criticalSection,
                  flex: 1,
                  minWidth: 220,
                },
                { field: 'severity', headerName: 'Severidad', width: 100 },
              ]}
              emptyMessage={copy.inpatient.noCriticals}
              extraBulkActions={(selectedIds) => [
                {
                  id: 'ack',
                  label: copy.inpatient.acknowledge,
                  requiresConfirmation: true,
                  onClick: () => {
                    for (const id of selectedIds) {
                      if (ackingId !== id) void handleAck(id);
                    }
                  },
                },
              ]}
              data-testid="epis2-service-critical-grid"
            />
          )}
        </EpisWorkspaceSection>

        {data.probableDischarges.length > 0 ? (
          <EpisWorkspaceSection title={copy.inpatient.probableDischarge}>
            <DashboardHomogeneousGrid
              rows={data.probableDischarges.map((d) => ({
                id: d.patientId,
                title: `${d.patientDisplayName} (${d.bedLabel})`,
                reason: d.reason,
                patientId: d.patientId,
              }))}
              columns={[
                {
                  field: 'title',
                  headerName: copy.dashboard.gridColumnPatient,
                  flex: 1,
                  minWidth: 180,
                },
                {
                  field: 'reason',
                  headerName: copy.dashboard.gridColumnTitle,
                  flex: 1,
                  minWidth: 160,
                },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              onRowClick={(row) => onOpenPatient(String(row.patientId))}
              extraBulkActions={(selectedIds) =>
                selectedIds.length === 1
                  ? [
                      {
                        id: 'epicrisis',
                        label: copy.inpatient.prepareDischarge,
                        onClick: () => onOpenEpicrisis?.(selectedIds[0]!),
                      },
                    ]
                  : []
              }
              data-testid="epis2-service-discharge-grid"
            />
          </EpisWorkspaceSection>
        ) : null}

        {data.pendingWorkItems.length > 0 ? (
          <EpisWorkspaceSection title={copy.inpatient.pendingTeam}>
            <DashboardHomogeneousGrid
              rows={data.pendingWorkItems.map((w) => ({
                id: w.id,
                title: w.label,
                patientId: w.patientId ?? w.id,
              }))}
              columns={[
                {
                  field: 'title',
                  headerName: copy.dashboard.gridColumnTitle,
                  flex: 1,
                  minWidth: 200,
                },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              onRowClick={(row) => {
                if (row.patientId) onOpenPatient(String(row.patientId));
              }}
              data-testid="epis2-service-pending-grid"
            />
          </EpisWorkspaceSection>
        ) : null}
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
