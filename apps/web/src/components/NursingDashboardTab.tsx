import type { NursingDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import { EpisChip, EpisWorkspaceSection, Stack, Typography } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';
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
  const marRows = useMemo(
    () =>
      data.scheduledMar.map((dose) => ({
        id: dose.id,
        patientDisplayName: dose.patientDisplayName,
        medication: `${dose.medication} ${dose.doseText} (${dose.route})`,
        windowEnd: dose.windowEnd,
        patientId: dose.patientId,
        requiresDoubleCheck: dose.requiresDoubleCheck,
      })),
    [data.scheduledMar],
  );

  const marColumns = useMemo<ClinicalGridColDef[]>(
    () => [
      {
        field: 'patientDisplayName',
        headerName: copy.dashboard.gridColumnPatient,
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'medication',
        headerName: copy.inpatient.scheduledMar,
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'windowEnd',
        headerName: copy.dashboard.gridColumnUpdated,
        width: 120,
        valueFormatter: (value) =>
          value
            ? new Date(String(value)).toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
      },
      {
        field: 'requiresDoubleCheck',
        headerName: copy.dashboard.gridColumnStatus,
        width: 120,
        renderCell: ({ value }) =>
          value ? (
            <EpisChip size="small" label={copy.inpatient.doubleCheckRequired} color="warning" />
          ) : null,
        sortable: false,
      },
    ],
    [],
  );

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-nursing-rad">
      <Stack spacing={2} data-testid="epis2-dashboard-nursing">
        <EpisWorkspaceSection title={copy.inpatient.scheduledMar}>
          {data.scheduledMar.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.inpatient.noScheduledMar}
            </Typography>
          ) : (
            <DashboardHomogeneousGrid
              rows={marRows}
              columns={marColumns}
              emptyMessage={copy.inpatient.noScheduledMar}
              onRowClick={(row) => onOpenPatient(String(row.patientId ?? row.id))}
              extraBulkActions={(selectedIds) =>
                onOpenMarForm && selectedIds.length === 1
                  ? [
                      {
                        id: 'register-mar',
                        label: copy.inpatient.registerMar,
                        onClick: () => {
                          const row = marRows.find((r) => r.id === selectedIds[0]);
                          if (row) onOpenMarForm(row.patientId);
                        },
                      },
                    ]
                  : []
              }
              data-testid="epis2-nursing-mar-grid"
            />
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
            <EpisChip key={task.id} label={task.label} size="small" variant="outlined" />
          ))}
        </Stack>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
