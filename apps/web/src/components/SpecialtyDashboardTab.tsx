import type { SpecialtyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisWorkspaceSection, Alert,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
  Stack, } from '@epis2/epis2-ui';

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
      <EpisWorkspaceSection title={copy.specialty.idcPanelsTitle} testId="epis2-specialty-idc-panels">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.partogramTitle} testId="epis2-specialty-partogram">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.oncologyBoardTitle} testId="epis2-specialty-oncology-board">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.odontogramTitle} testId="epis2-specialty-odontogram">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.endoscopyTitle} testId="epis2-specialty-endoscopy">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.ophthalmologyTitle} testId="epis2-specialty-ophthalmology">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.hemodialysisTitle} testId="epis2-specialty-hemodialysis">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.kinesiologyTitle} testId="epis2-specialty-kinesiology">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.nutritionTitle} testId="epis2-specialty-nutrition">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.chemotherapyTitle} testId="epis2-specialty-chemotherapy">
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
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.specialty.psychiatryTitle} testId="epis2-specialty-psychiatry">
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
      </EpisWorkspaceSection>
    </Stack>
  );
}
