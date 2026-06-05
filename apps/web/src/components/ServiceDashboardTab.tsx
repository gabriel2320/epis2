import type { ServiceDashboardResponse } from '@epis2/contracts';
import { lazy, Suspense, useState } from 'react';
import { copy } from '@epis2/design-system';
import { acknowledgeCriticalResult } from '../api/dashboardApi.js';

import {
  Alert,
  Box,
  Button,
  Chip,
  EpisLoadingState,
  List,
  ListItem,
  ListItemText,
  Paper,
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
  onOpenPatient: (patientId: string) => void;
  onReload: () => void;
};

export function ServiceDashboardTab({ data, onOpenPatient, onReload }: ServiceDashboardTabProps) {
  const [ackingId, setAckingId] = useState<string | null>(null);

  const handleAck = async (criticalId: string) => {
    setAckingId(criticalId);
    try {
      await acknowledgeCriticalResult(criticalId);
      onReload();
    } finally {
      setAckingId(null);
    }
  };

  return (
    <Stack spacing={2} data-testid="epis2-dashboard-service">
      <Box>
        <Typography variant="h6">{data.unitName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {data.unitCode} · {copy.demoBadge}
        </Typography>
      </Box>

      <Suspense fallback={<EpisLoadingState label={copy.charts.loading} />}>
        <LazyServiceDashboardCharts data={data} />
      </Suspense>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.inpatient.census}
        </Typography>
        <List dense disablePadding>
          {data.census.map((bed) => (
            <ListItem key={bed.bedId} disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={`${bed.bedLabel} — ${bed.status === 'occupied' ? bed.patientDisplayName ?? copy.inpatient.occupied : copy.inpatient.available}`}
                secondary={bed.demoCaseCode ?? undefined}
              />
              {bed.patientId ? (
                <Button size="small" onClick={() => onOpenPatient(bed.patientId!)}>
                  {copy.inpatient.openPatient}
                </Button>
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
