import type { NursingDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Paper, Stack, Typography, Button, Chip } from '@epis2/epis2-ui';
import { WorklistDraftGrid } from './WorklistDraftGrid.js';

export type NursingDashboardTabProps = {
  data: NursingDashboardResponse;
  onOpenPatient: (patientId: string) => void;
  onOpenDraft: (draftId: string) => void;
};

export function NursingDashboardTab({
  data,
  onOpenPatient,
  onOpenDraft,
}: NursingDashboardTabProps) {
  return (
    <Stack spacing={2} data-testid="epis2-dashboard-nursing">
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.inpatient.scheduledMar}
        </Typography>
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
                <Button size="small" onClick={() => onOpenPatient(dose.patientId)}>
                  {copy.inpatient.openPatient}
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.dashboard.myOpenDrafts}
        </Typography>
        <WorklistDraftGrid
          rows={data.nursingDrafts}
          emptyMessage={copy.dashboard.emptyDrafts}
          onOpenDraft={onOpenDraft}
          data-testid="epis2-nursing-drafts"
        />
      </Paper>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {data.demoTasks.map((task) => (
          <Chip key={task.id} label={task.label} size="small" variant="outlined" />
        ))}
      </Stack>
    </Stack>
  );
}
