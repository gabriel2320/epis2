import type { ApsDashboardResponse } from '@epis2/contracts';
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

export type ApsDashboardTabProps = {
  data: ApsDashboardResponse;
  onOpenPatient?: (patientId: string) => void;
};

export function ApsDashboardTab({ data, onOpenPatient }: ApsDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-aps-dashboard">
      <Alert severity="info">{copy.aps.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric
          label={copy.aps.metrics.enrolledPrograms}
          value={String(data.metrics.enrolledPrograms)}
        />
        <EpisMetric
          label={copy.aps.metrics.pendingScreenings}
          value={String(data.metrics.pendingScreenings)}
        />
        <EpisMetric
          label={copy.aps.metrics.homeVisitsToday}
          value={String(data.metrics.homeVisitsToday)}
        />
      </Stack>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-idc-panels">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.idcPanelsTitle}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              label={`IDC ${panel.idc}: ${panel.label}`}
              size="small"
              color={panel.status === 'active' ? 'primary' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-aps-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-cardiovascular">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.cardiovascularTitle}
        </Typography>
        <List dense data-testid="epis2-aps-cardiovascular-rows">
          {data.cardiovascularControls.map((row) => (
            <ListItem key={row.patientId} disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`HbA1c ${row.hba1c ?? '—'} · PA ${row.bloodPressure} · LDL ${row.ldl ?? '—'} · ${row.targetMet ? copy.aps.targetMet : copy.aps.targetPending}`}
              />
              {onOpenPatient ? (
                <Button size="small" variant="text" onClick={() => onOpenPatient(row.patientId)}>
                  {copy.aps.openPatientChart}
                </Button>
              ) : null}
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-framingham">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.framinghamTitle}
        </Typography>
        <List dense>
          {data.framinghamScores.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.riskPercent10y}% · ${row.riskCategory}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-preventive-exam">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.preventiveExamTitle}
        </Typography>
        <List dense>
          {data.preventiveExams.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={`${row.patientDisplayName} (${row.ageYears} años)`}
                secondary={row.pendingItems.join(' · ') || copy.aps.noPendingItems}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-diabetic-foot">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.diabeticFootTitle}
        </Typography>
        <List dense>
          {data.diabeticFootScreenings.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.monofilamentResult} · ${row.pulseStatus}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-mental-health">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.mentalHealthTitle}
        </Typography>
        <List dense>
          {data.mentalHealthScreenings.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`PHQ-9 ${row.phq9Score} · GAD-7 ${row.gad7Score}${row.referralSuggested ? ` · ${copy.aps.referralSuggested}` : ''}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-child-wellness">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.childWellnessTitle}
        </Typography>
        <List dense>
          {data.childWellnessControls.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.ageMonths} meses · P${row.growthPercentile} · ${copy.aps.nextControl} ${row.nextControlDue}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-immunization">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.immunizationTitle}
        </Typography>
        <List dense>
          {data.immunizationSchedule.map((row) => (
            <ListItem key={`${row.patientId}-${row.vaccine}`} disablePadding>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.vaccine}`}
                secondary={`${row.dueDate} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-prenatal">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.prenatalTitle}
        </Typography>
        <List dense>
          {data.prenatalControls.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`EG ${row.gestationalWeeks} sem · AU ${row.fundalHeightCm} cm · FCF ${row.fetalHeartRate}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-ministerial-referral">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.ministerialReferralTitle}
        </Typography>
        <List dense>
          {data.ministerialReferrals.map((row) => (
            <ListItem key={row.patientId} disablePadding>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.program} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-aps-home-visit">
        <Typography variant="subtitle2" gutterBottom>
          {copy.aps.homeVisitTitle}
        </Typography>
        <List dense data-testid="epis2-aps-home-visit-rows">
          {data.homeVisits.map((row) => (
            <ListItem key={row.visitId} disablePadding>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.territory}`}
                secondary={`${row.scheduledAt} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
