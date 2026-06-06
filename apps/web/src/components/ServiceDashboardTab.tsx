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
  Chip,
  EpisLoadingState,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@epis2/epis2-ui';

const LazyServiceDashboardCharts = lazy(() =>
  import('./ServiceDashboardCharts.js').then((m) => ({
    default: m.ServiceDashboardCharts,
  })),
);

export type ServiceDashboardTabProps = {
  data: ServiceDashboardResponse;
  activePatientId?: string;
  onOpenPatient: (patientId: string) => void;
  onOpenEpicrisis?: (patientId: string) => void;
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
  const [transferTargets, setTransferTargets] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const availableBeds = useMemo(
    () => data.census.filter((b) => b.status === 'available'),
    [data.census],
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

  const handleTransfer = async (admissionId: string) => {
    const targetBedId = transferTargets[admissionId];
    if (!targetBedId) return;
    setStatusMsg(null);
    try {
      await transferInpatientAdmission(admissionId, targetBedId);
      setStatusMsg(copy.inpatient.transferSuccess);
      onReload();
    } catch {
      setStatusMsg(copy.errors.genericMessage);
    }
  };

  const handleDischarge = async (admissionId: string, patientId?: string) => {
    setStatusMsg(null);
    try {
      const res = await dischargeInpatientAdmission(admissionId);
      setStatusMsg(copy.inpatient.dischargeSuccess);
      onReload();
      if (patientId && onOpenEpicrisis) onOpenEpicrisis(patientId);
      void res;
    } catch {
      setStatusMsg(copy.errors.genericMessage);
    }
  };

  return (
    <Stack spacing={2} data-testid="epis2-dashboard-service">
      <Box>
        <Typography variant="h6">{data.unitName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {data.unitCode} · {copy.demoBadge}
        </Typography>
      </Box>

      {statusMsg ? <Alert severity="info">{statusMsg}</Alert> : null}

      {activePatientId && availableBeds.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-inpatient-admit">
          <Typography variant="subtitle2" gutterBottom>
            {copy.inpatient.admitTitle}
          </Typography>
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
        </Paper>
      ) : null}

      <Suspense fallback={<EpisLoadingState label={copy.charts.loading} />}>
        <LazyServiceDashboardCharts data={data} />
      </Suspense>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.inpatient.census}
        </Typography>
        <List dense disablePadding>
          {data.census.map((bed) => (
            <ListItem key={bed.bedId} disablePadding sx={{ py: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <ListItemText
                primary={`${bed.bedLabel} — ${bed.status === 'occupied' ? bed.patientDisplayName ?? copy.inpatient.occupied : copy.inpatient.available}`}
                secondary={bed.demoCaseCode ?? undefined}
              />
              {bed.patientId ? (
                <Button size="small" onClick={() => onOpenPatient(bed.patientId!)}>
                  {copy.inpatient.openPatient}
                </Button>
              ) : null}
              {bed.admissionId && availableBeds.length > 0 ? (
                <>
                  <Select
                    size="small"
                    displayEmpty
                    value={transferTargets[bed.admissionId] ?? ''}
                    onChange={(e) =>
                      setTransferTargets((prev) => ({
                        ...prev,
                        [bed.admissionId!]: String(e.target.value),
                      }))
                    }
                    sx={{ minWidth: 120 }}
                    data-testid={`epis2-inpatient-transfer-select-${bed.admissionId}`}
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
                    onClick={() => void handleTransfer(bed.admissionId!)}
                    data-testid={`epis2-inpatient-transfer-${bed.admissionId}`}
                  >
                    {copy.inpatient.transferBed}
                  </Button>
                </>
              ) : null}
              {bed.admissionId ? (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => bed.patientId && onOpenEpicrisis?.(bed.patientId)}
                  >
                    {copy.inpatient.prepareDischarge}
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => void handleDischarge(bed.admissionId!, bed.patientId)}
                    data-testid={`epis2-discharge-${bed.admissionId}`}
                  >
                    {copy.inpatient.dischargePatient}
                  </Button>
                </>
              ) : null}
            </ListItem>
          ))}
        </List>
      </Paper>

      {data.activeOrders.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {copy.inpatient.activeOrders}
          </Typography>
          <List dense disablePadding>
            {data.activeOrders.map((o) => (
              <ListItem key={o.id} disablePadding>
                <ListItemText
                  primary={`${o.patientDisplayName} — ${o.title}`}
                  secondary={`${o.orderType} · ${o.priority}`}
                />
                <Button size="small" onClick={() => onOpenPatient(o.patientId)}>
                  {copy.inpatient.openPatient}
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.inpatient.criticalUnacked}
        </Typography>
        {data.unacknowledgedCriticals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.inpatient.noCriticals}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {data.unacknowledgedCriticals.map((c) => (
              <Alert
                key={c.id}
                severity={c.severity === 'critical' ? 'error' : 'warning'}
                action={
                  <Button
                    size="small"
                    color="inherit"
                    disabled={ackingId === c.id}
                    onClick={() => void handleAck(c.id)}
                    data-testid={`epis2-ack-critical-${c.id}`}
                  >
                    {copy.inpatient.acknowledge}
                  </Button>
                }
              >
                <strong>{c.patientDisplayName}</strong> — {c.label}: {c.valueText}
              </Alert>
            ))}
          </Stack>
        )}
      </Paper>

      {data.probableDischarges.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {copy.inpatient.probableDischarge}
          </Typography>
          <List dense disablePadding>
            {data.probableDischarges.map((d) => (
              <ListItem key={d.patientId} disablePadding>
                <ListItemText
                  primary={`${d.patientDisplayName} (${d.bedLabel})`}
                  secondary={d.reason}
                />
                <Button size="small" onClick={() => onOpenPatient(d.patientId)}>
                  {copy.inpatient.openPatient}
                </Button>
                <Button size="small" onClick={() => onOpenEpicrisis?.(d.patientId)}>
                  {copy.inpatient.prepareDischarge}
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : null}

      {data.pendingWorkItems.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {copy.inpatient.pendingTeam}
          </Typography>
          {data.pendingWorkItems.map((w) => (
            <Chip
              key={w.id}
              label={w.label}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
              onClick={w.patientId ? () => onOpenPatient(w.patientId!) : undefined}
            />
          ))}
        </Paper>
      ) : null}
    </Stack>
  );
}
