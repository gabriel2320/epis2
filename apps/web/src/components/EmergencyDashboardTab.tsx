import type { EmergencyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Button,
  Chip,
  EpisMetric,
  EpisWorkspaceSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';

export type EmergencyDashboardTabProps = {
  data: EmergencyDashboardResponse;
  activePatientId?: string | undefined;
  onOpenPatient?: ((patientId: string) => void) | undefined;
  onOpenEpicrisis?: ((patientId: string) => void) | undefined;
};

export function EmergencyDashboardTab({
  data,
  activePatientId,
  onOpenPatient,
  onOpenEpicrisis,
}: EmergencyDashboardTabProps) {
  const observationRows = data.triageQueue.filter((row) => row.status === 'observation');
  const triageRows = data.triageQueue.map((row) => ({
    id: row.id,
    title: `ESI ${row.triageLevel} — ${row.patientDisplayName}`,
    chiefComplaint: row.chiefComplaint,
    status: row.status,
    patientId: row.patientId,
  }));

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-emergency-rad">
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
        <EpisWorkspaceSection
          title={copy.emergency.idcPanelsTitle}
          testId="epis2-emergency-idc-panels"
        >
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
        </EpisWorkspaceSection>
        <EpisWorkspaceSection
          title={copy.emergency.dischargeActionsTitle}
          testId="epis2-emergency-discharge-actions"
        >
          {observationRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.longitudinal.emptySection}
            </Typography>
          ) : (
            <DashboardHomogeneousGrid
              rows={observationRows.map((row) => ({
                id: row.id,
                title: `${row.patientDisplayName} — ESI ${row.triageLevel}`,
                status: row.status,
                patientId: row.patientId,
              }))}
              columns={[
                {
                  field: 'title',
                  headerName: copy.dashboard.gridColumnPatient,
                  flex: 1,
                  minWidth: 180,
                },
                { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 120 },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              onRowClick={(row) => onOpenPatient?.(String(row.patientId))}
              extraBulkActions={(selectedIds) =>
                selectedIds.length === 1 && onOpenEpicrisis
                  ? [
                      {
                        id: 'epicrisis',
                        label: copy.emergency.prepareEpicrisis,
                        onClick: () => onOpenEpicrisis(selectedIds[0]!),
                      },
                    ]
                  : []
              }
              data-testid="epis2-emergency-observation-grid"
            />
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
        </EpisWorkspaceSection>
        <EpisWorkspaceSection
          title={copy.emergency.triageTitle}
          testId="epis2-emergency-triage-queue"
        >
          <DashboardHomogeneousGrid
            rows={triageRows}
            columns={[
              { field: 'title', headerName: copy.emergency.triageTitle, flex: 1, minWidth: 180 },
              {
                field: 'chiefComplaint',
                headerName: copy.dashboard.gridColumnTitle,
                flex: 1,
                minWidth: 160,
              },
              { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 120 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            onRowClick={(row) => onOpenPatient?.(String(row.patientId))}
            data-testid="epis2-emergency-triage-grid"
          />
        </EpisWorkspaceSection>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
