import type { ReceptionDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  EpisWorkspaceSection,
  Alert,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';

export type ReceptionDashboardTabProps = {
  data: ReceptionDashboardResponse;
  onOpenPatientSearch: () => void;
};

export function ReceptionDashboardTab({ data, onOpenPatientSearch }: ReceptionDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-reception-dashboard">
      <Alert severity="info">{copy.reception.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric
          label={copy.reception.metrics.checkedIn}
          value={String(data.metrics.checkedIn)}
        />
        <EpisMetric label={copy.reception.metrics.waiting} value={String(data.metrics.waiting)} />
        <EpisMetric
          label={copy.reception.metrics.companions}
          value={String(data.metrics.companions)}
        />
        <EpisMetric
          label={copy.reception.metrics.overbooking}
          value={String(data.metrics.overbookingAlerts)}
        />
      </Stack>
      <EpisWorkspaceSection
        title={copy.reception.idcPanelsTitle}
        testId="epis2-reception-idc-panels"
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              size="small"
              label={`IDC ${panel.idc}: ${panel.label}`}
              color={panel.status === 'active' ? 'primary' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-reception-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection
        title={copy.reception.callPanelTitle}
        testId="epis2-reception-call-panel"
      >
        <Typography variant="body2">
          {data.callPanel.ticketNumber
            ? `${data.callPanel.ticketNumber} — ${data.callPanel.lastCalled ?? ''}`
            : copy.reception.noCallYet}
        </Typography>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.reception.agendaTitle} testId="epis2-reception-agenda">
        <List dense>
          {data.todayAppointments.map((row) => (
            <ListItem key={row.id} disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.professionalName} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection
        title={copy.reception.waitingTitle}
        testId="epis2-reception-waiting-queue"
      >
        <List dense>
          {data.waitingQueue.map((row) => (
            <ListItem key={row.ticket} disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={`${row.ticket} — ${row.patientDisplayName}`}
                secondary={`${row.waitMinutes} min`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <Chip
        label={copy.reception.searchPatientCta}
        clickable
        color="primary"
        onClick={onOpenPatientSearch}
        data-testid="epis2-reception-search-patient"
      />
    </Stack>
  );
}
