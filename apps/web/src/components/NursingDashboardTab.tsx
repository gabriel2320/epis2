import type { NursingDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisWorkspaceSection, Stack, Typography, Button, Chip } from '@epis2/epis2-ui';
import { WorklistDraftGrid } from './WorklistDraftGrid.js';

export type NursingDashboardTabProps = {
  data: NursingDashboardResponse;
  onOpenPatient: (patientId: string) => void;
  onOpenDraft: (draftId: string) => void;
  onOpenMarForm?: (patientId: string) => void;
};

export function NursingDashboardTab({
  data,
  onOpenPatient,
  onOpenDraft,
  onOpenMarForm,
}: NursingDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-dashboard-nursing">
      <EpisWorkspaceSection title={copy.inpatient.scheduledMar}>
        {data.scheduledMar.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {copy.inpatient.noScheduledMar}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {data.scheduledMar.map((dose) => (
              <Stack
                key={dose.id}
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                data-testid={`epis2-nursing-mar-${dose.id}`}
              >
                <Typography variant="body2">
                  <strong>{dose.patientDisplayName}</strong> — {dose.medication} {dose.doseText}{' '}
                  ({dose.route}) · ventana hasta{' '}
                  {new Date(dose.windowEnd).toLocaleTimeString('es-CL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
                {dose.requiresDoubleCheck ? (
                  <Chip size="small" label={copy.inpatient.doubleCheckRequired} color="warning" />
                ) : null}
                {onOpenMarForm ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onOpenMarForm(dose.patientId)}
                    data-testid={`epis2-nursing-register-mar-${dose.id}`}
                  >
                    {copy.inpatient.registerMar}
                  </Button>
                ) : null}
                <Button size="small" onClick={() => onOpenPatient(dose.patientId)}>
                  {copy.inpatient.openPatient}
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.dashboard.myOpenDrafts}>
        <WorklistDraftGrid
          rows={data.nursingDrafts}
          emptyMessage={copy.dashboard.emptyDrafts}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-nursing-drafts"
        />
      </EpisWorkspaceSection>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {data.demoTasks.map((task) => (
          <Chip key={task.id} label={task.label} size="small" variant="outlined" />
        ))}
      </Stack>
    </Stack>
  );
}
