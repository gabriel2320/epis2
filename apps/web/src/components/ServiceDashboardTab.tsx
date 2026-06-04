import type { ServiceDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { acknowledgeCriticalResult } from '../api/dashboardApi.js';

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
