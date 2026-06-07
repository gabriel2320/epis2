import type { EmergencyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Button,
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
  activePatientId?: string;
  onOpenPatient?: (patientId: string) => void;
  onOpenEpicrisis?: (patientId: string) => void;
};

export function EmergencyDashboardTab({
  data,
  activePatientId,
  onOpenPatient,
  onOpenEpicrisis,
}: EmergencyDashboardTabProps) {
  const observationRows = data.triageQueue.filter((row) => row.status === 'observation');

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
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-emergency-discharge-actions">
        <Typography variant="subtitle2" gutterBottom>
          {copy.emergency.dischargeActionsTitle}
        </Typography>
        {observationRows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {observationRows.map((row) => (
              <Stack
                key={row.id}
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
              >
                <Typography variant="body2">
                  {row.patientDisplayName} — ESI {row.triageLevel}
                </Typography>
                {onOpenPatient ? (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => onOpenPatient(row.patientId)}
                    data-testid={`epis2-emergency-open-chart-${row.patientId}`}
                  >
                    {copy.emergency.openPatientChart}
                  </Button>
                ) : null}
                {onOpenEpicrisis ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onOpenEpicrisis(row.patientId)}
                    data-testid={`epis2-emergency-prepare-epicrisis-${row.patientId}`}
                  >
                    {copy.emergency.prepareEpicrisis}
                  </Button>
                ) : null}
              </Stack>
            ))}
          </Stack>
        )}
        {activePatientId && onOpenEpicrisis ? (
          <Button
            size="small"
            variant="contained"
            color="warning"
            sx={{ mt: 1 }}
            onClick={() => onOpenEpicrisis(activePatientId)}
            data-testid="epis2-emergency-prepare-epicrisis-active"
          >
            {copy.emergency.prepareEpicrisis}
          </Button>
        ) : null}
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
