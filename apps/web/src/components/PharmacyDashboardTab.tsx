import type { PharmacyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import {
  Alert,
  Chip,
  EpisMetric,
  EpisWorkspaceSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';
import { EpisRadFormSectionAccordion } from './rad/EpisRadFormSectionAccordion.js';

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
  const validationRows = useMemo(
    () =>
      data.pendingValidations.map((v) => ({
        id: v.id,
        title: `${v.patientDisplayName} — ${v.title}`,
        status: v.status,
        patientId: v.patientId,
        draftId: v.id,
      })),
    [data.pendingValidations],
  );

  const dispensingRows = useMemo(
    () =>
      data.dispensingQueue.map((row) => ({
        id: row.prescriptionId,
        title: `${row.patientDisplayName} — ${row.medication}`,
        status: row.status,
        prescriptionId: row.prescriptionId,
      })),
    [data.dispensingQueue],
  );

  const validationColumns = useMemo<ClinicalGridColDef[]>(
    () => [
      { field: 'title', headerName: copy.inpatient.pharmacyValidations, flex: 1, minWidth: 220 },
      { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 120 },
    ],
    [],
  );

  const dispensingColumns = useMemo<ClinicalGridColDef[]>(
    () => [
      { field: 'title', headerName: copy.pharmacy.dispensingTitle, flex: 1, minWidth: 220 },
      { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 120 },
    ],
    [],
  );

  const reconciliationRows = useMemo(
    () =>
      data.reconciliationCandidates.map((r) => ({
        id: r.patientId,
        title: r.patientDisplayName,
        reason: `${r.reason} (${r.activeMedicationCount} meds)`,
        patientId: r.patientId,
      })),
    [data.reconciliationCandidates],
  );

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-pharmacy-rad">
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

        <EpisWorkspaceSection title={copy.inpatient.pharmacyValidations}>
          {validationRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.inpatient.noPharmacyPending}
            </Typography>
          ) : (
            <DashboardHomogeneousGrid
              rows={validationRows}
              columns={validationColumns}
              emptyMessage={copy.inpatient.noPharmacyPending}
              onRowClick={(row) => onOpenDraft(String(row.draftId ?? row.id))}
              extraBulkActions={(selectedIds) =>
                selectedIds.length === 1
                  ? [
                      {
                        id: 'open-patient',
                        label: copy.inpatient.openPatient,
                        onClick: () => {
                          const row = validationRows.find((r) => r.id === selectedIds[0]);
                          if (row) onOpenPatient(row.patientId);
                        },
                      },
                    ]
                  : []
              }
              data-testid="epis2-pharmacy-validations-grid"
            />
          )}
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.pharmacy.dispensingTitle} testId="epis2-pharmacy-dispensing">
          <DashboardHomogeneousGrid
            rows={dispensingRows}
            columns={dispensingColumns}
            emptyMessage={copy.longitudinal.emptySection}
            data-testid="epis2-pharmacy-dispensing-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.pharmacy.reconciliationTitle} testId="epis2-pharmacy-reconciliation">
          {reconciliationRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.inpatient.noPharmacyPending}
            </Typography>
          ) : (
            <DashboardHomogeneousGrid
              rows={reconciliationRows}
              columns={[
                { field: 'title', headerName: copy.dashboard.gridColumnPatient, flex: 1, minWidth: 160 },
                { field: 'reason', headerName: copy.dashboard.gridColumnTitle, flex: 1, minWidth: 180 },
              ]}
              emptyMessage={copy.inpatient.noPharmacyPending}
              onRowClick={(row) => onOpenReconciliation(String(row.patientId))}
              extraBulkActions={(selectedIds) =>
                selectedIds.length === 1
                  ? [
                      {
                        id: 'open-patient',
                        label: copy.inpatient.openPatient,
                        onClick: () => onOpenPatient(selectedIds[0]!),
                      },
                    ]
                  : []
              }
              data-testid="epis2-pharmacy-reconciliation-grid"
            />
          )}
        </EpisWorkspaceSection>

        <EpisRadFormSectionAccordion
          id="pharmacy-secondary-panels"
          title={copy.pharmacy.idcPanelsTitle}
          testId="epis2-pharmacy-secondary-accordion"
        >
          <Stack spacing={2}>
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
            <DashboardHomogeneousGrid
              rows={data.ySiteChecks.map((row, index) => ({
                id: `ysite-${index}`,
                title: `${row.drugA} + ${row.drugB}`,
                status: row.compatible ? 'Compatible' : 'Incompatible',
                note: row.note,
              }))}
              columns={[
                { field: 'title', headerName: copy.pharmacy.ySiteTitle, flex: 1, minWidth: 160 },
                { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 120 },
                { field: 'note', headerName: 'Nota', flex: 1, minWidth: 120 },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              selectable={false}
              data-testid="epis2-pharmacy-ysite-grid"
            />
          </Stack>
        </EpisRadFormSectionAccordion>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {data.demoTasks.map((task) => (
            <Chip key={task.id} label={task.label} size="small" variant="outlined" />
          ))}
        </Stack>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
