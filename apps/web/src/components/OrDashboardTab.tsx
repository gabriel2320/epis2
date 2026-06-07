import type { OrDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisWorkspaceSection, Alert,
  Button,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography, } from '@epis2/epis2-ui';

export type OrDashboardTabProps = {
  data: OrDashboardResponse;
  onOpenPatient?: (patientId: string) => void;
};

const STATUS_LABEL: Record<OrDashboardResponse['surgicalSchedule'][number]['status'], string> = {
  scheduled: copy.or.statusScheduled,
  preparing: copy.or.statusPreparing,
  in_progress: copy.or.statusInProgress,
  completed: copy.or.statusCompleted,
};

const WHO_STATUS_LABEL: Record<
  OrDashboardResponse['whoSafetyChecklist'][number]['status'],
  string
> = {
  pending: copy.or.whoStatusPending,
  in_progress: copy.or.whoStatusInProgress,
  completed: copy.or.whoStatusCompleted,
};

export function OrDashboardTab({ data, onOpenPatient }: OrDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-or-dashboard">
      <Alert severity="info">{copy.or.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric
          label={copy.or.metrics.roomsInUse}
          value={String(data.metrics.operatingRoomsInUse)}
        />
        <EpisMetric
          label={copy.or.metrics.scheduledToday}
          value={String(data.metrics.scheduledToday)}
        />
        <EpisMetric
          label={copy.or.metrics.inProgress}
          value={String(data.metrics.inProgress)}
        />
      </Stack>
      <EpisWorkspaceSection title={copy.or.idcPanelsTitle} testId="epis2-or-idc-panels">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              label={`IDC ${panel.idc}: ${panel.label}`}
              size="small"
              color={panel.status === 'active' ? 'primary' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-or-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.surgicalScheduleTitle} testId="epis2-or-surgical-schedule">
        <List dense data-testid="epis2-or-surgical-schedule-rows">
          {data.surgicalSchedule.map((row) => (
            <ListItem
              key={row.caseId}
              disablePadding
              sx={{ py: 0.5, flexWrap: 'wrap', gap: 0.5 }}
            >
              <ListItemText
                primary={`${row.operatingRoom} — ${row.procedureName}`}
                secondary={`${row.patientDisplayName} · ${row.scheduledStart} · ${row.estimatedDurationMin} min · ${STATUS_LABEL[row.status]}`}
              />
              {onOpenPatient ? (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => onOpenPatient(row.patientId)}
                  data-testid={`epis2-or-open-chart-${row.patientId}`}
                >
                  {copy.or.openPatientChart}
                </Button>
              ) : null}
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.whoChecklistTitle} testId="epis2-or-who-checklist">
        {data.whoSafetyChecklist.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-who-checklist-rows">
            {data.whoSafetyChecklist.map((row) => (
              <ListItem key={row.pauseId} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={`${row.operatingRoom} — ${row.pauseLabel}`}
                  secondary={`${row.patientDisplayName} · ${copy.or.whoChecklistProgress} ${row.completedItems}/${row.totalItems} · ${WHO_STATUS_LABEL[row.status]}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.preanesthesiaTitle} testId="epis2-or-preanesthesia">
        <List dense data-testid="epis2-or-preanesthesia-rows">
          {data.preanesthesiaEvaluations.map((row) => (
            <ListItem
              key={row.caseId}
              disablePadding
              sx={{ py: 0.5, flexWrap: 'wrap', gap: 0.5 }}
            >
              <ListItemText
                primary={`${row.operatingRoom} — ${row.patientDisplayName}`}
                secondary={`${copy.or.preanesthesiaAsa} ${row.asaClass} · ${copy.or.preanesthesiaMallampati} ${row.mallampati}${row.allergyAlert ? ` · ${row.allergyAlert}` : ''} · ${row.evaluationStatus === 'complete' ? copy.or.preanesthesiaComplete : copy.or.preanesthesiaPending}`}
              />
              {onOpenPatient ? (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => onOpenPatient(row.patientId)}
                  data-testid={`epis2-or-preanesthesia-open-${row.patientId}`}
                >
                  {copy.or.openPatientChart}
                </Button>
              ) : null}
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.intraopAnesthesiaTitle} testId="epis2-or-intraop-anesthesia">
        {data.intraopAnesthesia.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-intraop-anesthesia-rows">
            {data.intraopAnesthesia.map((row) => (
              <ListItem key={`${row.caseId}-${row.timeLabel}`} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={`${row.timeLabel} — FC ${row.heartRate} · PAM ${row.map}`}
                  secondary={`SpO₂ ${row.spo2}% · ${row.agent}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.operativeProtocolTitle} testId="epis2-or-operative-protocol">
        {data.operativeProtocols.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-operative-protocol-rows">
            {data.operativeProtocols.map((row) => (
              <ListItem key={row.caseId} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={`${row.operatingRoom} — ${row.patientDisplayName}`}
                  secondary={`${row.procedureSummary} · ${row.documentedBy}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.spongeCountTitle} testId="epis2-or-sponge-count">
        {data.spongeCounts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-sponge-count-rows">
            {data.spongeCounts.map((row) => (
              <ListItem key={row.caseId} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={`${row.operatingRoom} — ${row.initialCount}/${row.finalCount}`}
                  secondary={`${row.verifiedBy} · ${row.status === 'balanced' ? copy.or.spongeCountBalanced : copy.or.spongeCountPending}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.intraopBiopsyTitle} testId="epis2-or-intraop-biopsy">
        {data.intraopBiopsies.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-intraop-biopsy-rows">
            {data.intraopBiopsies.map((row, index) => (
              <ListItem key={`${row.caseId}-${index}`} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={row.specimenLabel}
                  secondary={`${row.urgency} · ${row.status}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.urpaRecoveryTitle} testId="epis2-or-urpa-recovery">
        {data.urpaRecovery.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-urpa-recovery-rows">
            {data.urpaRecovery.map((row) => (
              <ListItem key={row.caseId} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={row.patientDisplayName}
                  secondary={`${copy.or.urpaAldrete} ${row.aldreteScore} · ${row.disposition}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.bloodBankTitle} testId="epis2-or-blood-bank">
        {data.bloodBankOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        ) : (
          <List dense data-testid="epis2-or-blood-bank-rows">
            {data.bloodBankOrders.map((row) => (
              <ListItem key={row.caseId} disablePadding sx={{ py: 0.25 }}>
                <ListItemText
                  primary={`${row.product} — ${row.units} U`}
                  secondary={row.status}
                />
              </ListItem>
            ))}
          </List>
        )}
      </EpisWorkspaceSection>
      <EpisWorkspaceSection title={copy.or.sterilizationTitle} testId="epis2-or-sterilization">
        <List dense data-testid="epis2-or-sterilization-rows">
          {data.sterilizationLots.map((row) => (
            <ListItem key={row.lotNumber} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.instrumentSet} — ${row.operatingRoom}`}
                secondary={`Lote ${row.lotNumber} · vence ${row.expiryDate}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>
    </Stack>
  );
}
