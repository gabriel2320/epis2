import type { PharmacyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Alert, Paper, Stack, Typography, Button, Chip } from '@epis2/epis2-ui';

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
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.inpatient.pharmacyValidations}
        </Typography>
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
      </Paper>

      {data.reconciliationCandidates.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {copy.inpatient.reconciliation}
          </Typography>
          {data.reconciliationCandidates.map((r) => (
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
          ))}
        </Paper>
      ) : null}

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {data.demoTasks.map((task) => (
          <Chip key={task.id} label={task.label} size="small" variant="outlined" />
        ))}
      </Stack>
    </Stack>
  );
}
