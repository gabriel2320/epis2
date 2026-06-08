import type { PatientDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import {
  Alert,
  Box,
  Button,
  EpisWorkspaceSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { LabObservationsGrid } from './LabObservationsGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';
import { WorklistDraftGrid } from './WorklistDraftGrid.js';

export type PatientDashboardTabProps = {
  data: PatientDashboardResponse;
  onOpenFicha: () => void;
  onOpenDraft: (draftId: string) => void;
};

export function PatientDashboardTab({ data, onOpenFicha, onOpenDraft }: PatientDashboardTabProps) {
  const timelineRows = useMemo(
    () =>
      data.timelinePreview.map((ev) => ({
        id: ev.id,
        title: ev.title,
        at: ev.at,
      })),
    [data.timelinePreview],
  );

  const timelineColumns = useMemo<ClinicalGridColDef[]>(
    () => [
      { field: 'title', headerName: copy.dashboard.gridColumnTitle, flex: 1, minWidth: 180 },
      {
        field: 'at',
        headerName: copy.dashboard.gridColumnUpdated,
        width: 170,
        valueFormatter: (value) =>
          value ? new Date(String(value)).toLocaleString('es-CL') : '',
      },
    ],
    [],
  );

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-patient-rad">
      <Stack spacing={2} data-testid="epis2-dashboard-patient">
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h6">{data.displayName}</Typography>
            {data.demoCaseCode ? (
              <Typography variant="body2" color="text.secondary">
                {data.demoCaseCode} · {copy.demoBadge}
              </Typography>
            ) : null}
          </Box>
          <Button size="small" variant="outlined" onClick={onOpenFicha}>
            {copy.dashboard.viewFullRecord}
          </Button>
        </Stack>

        {data.allergies.length > 0 ? (
          <Alert severity="warning">
            {copy.longitudinal.allergies}: {data.allergies.map((a) => a.substance).join(', ')}
          </Alert>
        ) : null}

        <EpisWorkspaceSection title={copy.longitudinal.problems}>
          {data.activeProblems.length > 0 ? (
            <DashboardHomogeneousGrid
              rows={data.activeProblems.map((problem, index) => ({
                id: `problem-${index}`,
                title: problem,
              }))}
              columns={[
                { field: 'title', headerName: copy.longitudinal.problems, flex: 1, minWidth: 200 },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              selectable={false}
              data-testid="epis2-dashboard-patient-problems-grid"
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {copy.longitudinal.emptySection}
            </Typography>
          )}
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.dashboard.pendingReview}>
          <WorklistDraftGrid
            rows={data.pendingDrafts}
            showPatientColumn={false}
            showUpdatedColumn={false}
            emptyMessage={copy.dashboard.emptyDrafts}
            onOpenDraft={onOpenDraft}
            data-testid="epis2-dashboard-patient-drafts-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.longitudinal.observations}>
          <LabObservationsGrid
            rows={data.recentObservations}
            data-testid="epis2-dashboard-patient-labs-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.longitudinal.timeline}>
          <DashboardHomogeneousGrid
            rows={timelineRows}
            columns={timelineColumns}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={timelineRows.length > 1}
            data-testid="epis2-dashboard-patient-timeline-grid"
          />
        </EpisWorkspaceSection>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
