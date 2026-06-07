import type { EmergencyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@epis2/epis2-ui';

export type EmergencyDashboardTabProps = {
  data: EmergencyDashboardResponse;
};

export function EmergencyDashboardTab({ data }: EmergencyDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-emergency-dashboard">
      <Alert severity="warning">{copy.emergency.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric label={copy.emergency.metrics.waiting} value={String(data.metrics.waiting)} />
        <EpisMetric
          label={copy.emergency.metrics.observation}
          value={String(data.metrics.inObservation)}
        />
        <EpisMetric
          label={copy.emergency.metrics.discharged}
          value={String(data.metrics.dischargedToday)}
        />
        <EpisMetric
          label={copy.emergency.metrics.observationBeds}
          value={String(data.observationBeds)}
        />
      </Stack>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-emergency-idc-panels">
        <Typography variant="subtitle2" gutterBottom>
          {copy.emergency.idcPanelsTitle}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              label={`IDC ${panel.idc}: ${panel.label}`}
              size="small"
              color={panel.status === 'active' ? 'warning' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-emergency-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-emergency-triage-queue">
        <Typography variant="subtitle2" gutterBottom>
          {copy.emergency.triageTitle}
        </Typography>
        <List dense>
          {data.triageQueue.map((row) => (
            <ListItem key={row.id} disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={`ESI ${row.triageLevel} — ${row.patientDisplayName}`}
                secondary={`${row.chiefComplaint} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
