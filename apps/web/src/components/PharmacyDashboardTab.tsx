import type { PharmacyDashboardResponse } from '@epis2/contracts';
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

export type PharmacyDashboardTabProps = {
  data: PharmacyDashboardResponse;
  onOpenPatient: (patientId: string) => void;
  onOpenDraft: (draftId: string) => void;
  onOpenReconciliation: (patientId: string) => void;
};

export function PharmacyDashboardTab({
  data,
  onOpenPatient,
  onOpenDraft,
  onOpenReconciliation,
}: PharmacyDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-dashboard-pharmacy">
      <Alert severity="info">{copy.pharmacy.disclosure}</Alert>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <EpisMetric
          label={copy.pharmacy.metrics.activeModules}
          value={String(data.metrics.activePharmacyModules)}
        />
        <EpisMetric
          label={copy.pharmacy.metrics.pendingValidations}
          value={String(data.metrics.pendingValidationsCount)}
        />
        <EpisMetric
          label={copy.pharmacy.metrics.reconciliationCandidates}
          value={String(data.metrics.reconciliationCandidatesCount)}
        />
      </Stack>
      <EpisWorkspaceSection title={copy.pharmacy.idcPanelsTitle} testId="epis2-pharmacy-idc-panels">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {data.idcPanels.map((panel) => (
            <Chip
              key={panel.idc}
              label={`IDC ${panel.idc}: ${panel.label}`}
              size="small"
              color={panel.status === 'active' ? 'primary' : 'default'}
              variant={panel.status === 'active' ? 'filled' : 'outlined'}
              data-testid={`epis2-pharmacy-idc-${panel.idc}`}
            />
          ))}
        </Stack>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.ySiteTitle} testId="epis2-pharmacy-ysite">
        <List dense data-testid="epis2-pharmacy-ysite-rows">
          {data.ySiteChecks.map((row) => (
            <ListItem key={`${row.drugA}-${row.drugB}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.drugA} + ${row.drugB}`}
                secondary={`${row.compatible ? 'Compatible' : 'Incompatible'} · ${row.note}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.renalDoseTitle} testId="epis2-pharmacy-renal-dose">
        <List dense>
          {data.renalDoseAdjustments.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.medication}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.medication}`}
                secondary={`TFG ${row.gfrMlMin} mL/min · ${row.recommendedDose}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.tdmTitle} testId="epis2-pharmacy-tdm">
        <List dense>
          {data.tdmMonitoring.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.drug}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.drug}`}
                secondary={`${row.levelMcgMl} · objetivo ${row.targetRange}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.ramTitle} testId="epis2-pharmacy-ram">
        <List dense>
          {data.ramReports.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.suspectDrug}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.suspectDrug}`}
                secondary={`${row.reactionType} · ${row.severity}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.inpatient.pharmacyValidations}>
        {data.pendingValidations.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.inpatient.noPharmacyPending}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {data.pendingValidations.map((v) => (
              <Stack key={v.id} direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">
                  {v.patientDisplayName} — {v.title} ({v.status})
                </Typography>
                <Button
                  size="small"
                  onClick={() => onOpenDraft(v.id)}
                  data-testid={`epis2-pharmacy-review-${v.id}`}
                >
                  {copy.inpatient.reviewValidation}
                </Button>
                <Button size="small" variant="outlined" onClick={() => onOpenPatient(v.patientId)}>
                  {copy.inpatient.openPatient}
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.reconciliationTitle} testId="epis2-pharmacy-reconciliation">
        {data.reconciliationCandidates.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.inpatient.noPharmacyPending}
          </Typography>
        ) : (
          data.reconciliationCandidates.map((r) => (
            <Alert key={r.patientId} severity="warning" sx={{ mb: 1 }}>
              <strong>{r.patientDisplayName}</strong> — {r.reason} ({r.activeMedicationCount} meds:{' '}
              {r.medications.join(', ')})
              <Button
                size="small"
                sx={{ ml: 1 }}
                onClick={() => onOpenReconciliation(r.patientId)}
                data-testid={`epis2-pharmacy-reconcile-${r.patientId}`}
              >
                {copy.inpatient.openReconciliationForm}
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 1 }}
                onClick={() => onOpenPatient(r.patientId)}
                data-testid={`epis2-pharmacy-patient-${r.patientId}`}
              >
                {copy.inpatient.openPatient}
              </Button>
            </Alert>
          ))
        )}
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.dispensingTitle} testId="epis2-pharmacy-dispensing">
        <List dense>
          {data.dispensingQueue.map((row) => (
            <ListItem key={row.prescriptionId} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.medication}`}
                secondary={`${row.prescriptionId} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.crashCartTitle} testId="epis2-pharmacy-crash-cart">
        <List dense>
          {data.crashCartInventory.map((row) => (
            <ListItem key={row.cartId} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.cartId} — ${row.location}`}
                secondary={`Alertas vencimiento: ${row.expiryAlerts} · ${row.lastCheck}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.controlledSubstancesTitle} testId="epis2-pharmacy-controlled-substances">
        <List dense>
          {data.controlledSubstances.map((row) => (
            <ListItem key={row.medication} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.medication}
                secondary={`Saldo ${row.balanceUnits} u · ${row.discrepancyFlag ? 'Discrepancia' : 'Cuadrado'}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.returnTitle} testId="epis2-pharmacy-return">
        <List dense>
          {data.drugReturns.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.medication}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.medication}`}
                secondary={`${row.quantity} u · ${row.reason}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.pharmacy.stockoutTitle} testId="epis2-pharmacy-stockout">
        <List dense data-testid="epis2-pharmacy-stockout-rows">
          {data.stockoutAlerts.map((row) => (
            <ListItem key={row.medication} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.medication}
                secondary={
                  row.alternativeSuggested
                    ? `${row.daysUntilStockout} días · alt. ${row.alternativeSuggested}`
                    : `${row.daysUntilStockout} días hasta quiebre`
                }
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {data.demoTasks.map((task) => (
          <Chip key={task.id} label={task.label} size="small" variant="outlined" />
        ))}
      </Stack>
    </Stack>
  );
}
