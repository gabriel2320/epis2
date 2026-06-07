import type { SpecialtyDashboardResponse } from '@epis2/contracts';
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

export type SpecialtyDashboardTabProps = {
  data: SpecialtyDashboardResponse;
};

export function SpecialtyDashboardTab({ data }: SpecialtyDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-specialty-dashboard">
      <Alert severity="info">{copy.specialty.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric
          label={copy.specialty.metrics.activeModules}
          value={String(data.metrics.activeSpecialtyModules)}
        />
        <EpisMetric
          label={copy.specialty.metrics.pendingReviews}
          value={String(data.metrics.pendingGraphicReviews)}
        />
        <EpisMetric
          label={copy.specialty.metrics.scheduledBoards}
          value={String(data.metrics.scheduledBoards)}
        />
      </Stack>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-idc-panels">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.idcPanelsTitle}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              label={`IDC ${panel.idc}: ${panel.label}`}
              size="small"
              color={panel.status === 'active' ? 'primary' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-specialty-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-partogram">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.partogramTitle}
        </Typography>
        <List dense data-testid="epis2-specialty-partogram-rows">
          {data.partograms.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.cervicalDilationCm} cm · estación ${row.fetalStation} · ${row.updatedAt}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-oncology-board">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.oncologyBoardTitle}
        </Typography>
        <List dense>
          {data.oncologyBoardCases.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.tumorType} · ${row.discussionDate} · ${row.recommendation}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-odontogram">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.odontogramTitle}
        </Typography>
        <List dense>
          {data.odontograms.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`Piezas ${row.teethAffected} · ${row.conditionSummary}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-endoscopy">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.endoscopyTitle}
        </Typography>
        <List dense>
          {data.endoscopyReports.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.procedure}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.procedure}`}
                secondary={row.keyFinding}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-ophthalmology">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.ophthalmologyTitle}
        </Typography>
        <List dense>
          {data.ophthalmologyEvaluations.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`AV ${row.visualAcuity} · PIO ${row.iopMmHg} mmHg`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-hemodialysis">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.hemodialysisTitle}
        </Typography>
        <List dense>
          {data.hemodialysisSessions.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.sessionHours} h · UF ${row.ultrafiltrationMl} mL`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-kinesiology">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.kinesiologyTitle}
        </Typography>
        <List dense>
          {data.kinesiologyRecords.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.joint}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.joint}`}
                secondary={`ROM ${row.romDegrees}°`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-nutrition">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.nutritionTitle}
        </Typography>
        <List dense>
          {data.nutritionRecords.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`IMC ${row.bmi} · ${row.planStatus}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-chemotherapy">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.chemotherapyTitle}
        </Typography>
        <List dense>
          {data.chemotherapyProtocols.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.protocol} · día ${row.cycleDay}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-specialty-psychiatry">
        <Typography variant="subtitle2" gutterBottom>
          {copy.specialty.psychiatryTitle}
        </Typography>
        <List dense data-testid="epis2-specialty-psychiatry-rows">
          {data.psychiatryFollowups.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.scaleName} ${row.score}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}
