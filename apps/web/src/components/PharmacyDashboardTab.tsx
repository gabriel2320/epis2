import type { PharmacyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import {
  Alert,
  Box,
  Chip,
  EpisMetric,
  EpisWorkspaceSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';

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

  const renalDoseRows = useMemo(
    () =>
      data.renalDoseAdjustments.map((row, index) => ({
        id: `renal-${index}`,
        title: `${row.patientDisplayName} — ${row.medication}`,
        gfr: `${row.gfrMlMin} mL/min`,
        dose: row.recommendedDose,
      })),
    [data.renalDoseAdjustments],
  );

  const tdmRows = useMemo(
    () =>
      data.tdmMonitoring.map((row, index) => ({
        id: `tdm-${index}`,
        title: `${row.patientDisplayName} — ${row.drug}`,
        level: String(row.levelMcgMl),
        target: row.targetRange,
      })),
    [data.tdmMonitoring],
  );

  const ramRows = useMemo(
    () =>
      data.ramReports.map((row, index) => ({
        id: `ram-${index}`,
        title: `${row.patientDisplayName} — ${row.suspectDrug}`,
        reaction: row.reactionType,
        severity: row.severity,
      })),
    [data.ramReports],
  );

  const crashCartRows = useMemo(
    () =>
      data.crashCartInventory.map((row) => ({
        id: row.cartId,
        title: row.cartId,
        location: row.location,
        alerts: String(row.expiryAlerts),
      })),
    [data.crashCartInventory],
  );

  const controlledSubstanceRows = useMemo(
    () =>
      data.controlledSubstances.map((row, index) => ({
        id: `controlled-${index}`,
        title: row.medication,
        balance: String(row.balanceUnits),
        status: row.discrepancyFlag ? 'Discrepancia' : 'Cuadrado',
      })),
    [data.controlledSubstances],
  );

  const returnRows = useMemo(
    () =>
      data.drugReturns.map((row, index) => ({
        id: `return-${index}`,
        title: `${row.patientDisplayName} — ${row.medication}`,
        quantity: String(row.quantity),
        reason: row.reason,
      })),
    [data.drugReturns],
  );

  const stockoutRows = useMemo(
    () =>
      data.stockoutAlerts.map((row, index) => ({
        id: `stockout-${index}`,
        title: row.medication,
        days: String(row.daysUntilStockout),
        alternative: row.alternativeSuggested ?? '—',
      })),
    [data.stockoutAlerts],
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

        <EpisWorkspaceSection
          title={copy.pharmacy.idcPanelsTitle}
          testId="epis2-pharmacy-idc-panels"
        >
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
          <Box data-testid="epis2-pharmacy-ysite-rows">
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
          </Box>
        </EpisWorkspaceSection>

        <EpisWorkspaceSection
          title={copy.pharmacy.renalDoseTitle}
          testId="epis2-pharmacy-renal-dose"
        >
          <DashboardHomogeneousGrid
            rows={renalDoseRows}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 180,
              },
              { field: 'gfr', headerName: 'TFG', width: 100 },
              { field: 'dose', headerName: 'Dosis sugerida', flex: 1, minWidth: 140 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={false}
            data-testid="epis2-pharmacy-renal-dose-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.pharmacy.tdmTitle} testId="epis2-pharmacy-tdm">
          <DashboardHomogeneousGrid
            rows={tdmRows}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 180,
              },
              { field: 'level', headerName: 'Nivel', width: 100 },
              { field: 'target', headerName: 'Rango objetivo', flex: 1, minWidth: 140 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={false}
            data-testid="epis2-pharmacy-tdm-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.pharmacy.ramTitle} testId="epis2-pharmacy-ram">
          <DashboardHomogeneousGrid
            rows={ramRows}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 180,
              },
              { field: 'reaction', headerName: 'Reacción', flex: 1, minWidth: 140 },
              { field: 'severity', headerName: copy.dashboard.gridColumnStatus, width: 120 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={false}
            data-testid="epis2-pharmacy-ram-grid"
          />
        </EpisWorkspaceSection>

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

        <EpisWorkspaceSection
          title={copy.pharmacy.dispensingTitle}
          testId="epis2-pharmacy-dispensing"
        >
          <DashboardHomogeneousGrid
            rows={dispensingRows}
            columns={dispensingColumns}
            emptyMessage={copy.longitudinal.emptySection}
            data-testid="epis2-pharmacy-dispensing-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection
          title={copy.pharmacy.reconciliationTitle}
          testId="epis2-pharmacy-reconciliation"
        >
          {reconciliationRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {copy.inpatient.noPharmacyPending}
            </Typography>
          ) : (
            <DashboardHomogeneousGrid
              rows={reconciliationRows}
              columns={[
                {
                  field: 'title',
                  headerName: copy.dashboard.gridColumnPatient,
                  flex: 1,
                  minWidth: 160,
                },
                {
                  field: 'reason',
                  headerName: copy.dashboard.gridColumnTitle,
                  flex: 1,
                  minWidth: 180,
                },
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

        <EpisWorkspaceSection
          title={copy.pharmacy.crashCartTitle}
          testId="epis2-pharmacy-crash-cart"
        >
          <DashboardHomogeneousGrid
            rows={crashCartRows}
            columns={[
              { field: 'title', headerName: 'Carro', width: 120 },
              { field: 'location', headerName: 'Ubicación', flex: 1, minWidth: 160 },
              { field: 'alerts', headerName: 'Alertas vencimiento', width: 140 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={false}
            data-testid="epis2-pharmacy-crash-cart-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection
          title={copy.pharmacy.controlledSubstancesTitle}
          testId="epis2-pharmacy-controlled-substances"
        >
          <DashboardHomogeneousGrid
            rows={controlledSubstanceRows}
            columns={[
              { field: 'title', headerName: 'Medicamento', flex: 1, minWidth: 180 },
              { field: 'balance', headerName: 'Saldo', width: 100 },
              { field: 'status', headerName: copy.dashboard.gridColumnStatus, width: 120 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={false}
            data-testid="epis2-pharmacy-controlled-substances-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.pharmacy.returnTitle} testId="epis2-pharmacy-return">
          <DashboardHomogeneousGrid
            rows={returnRows}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 180,
              },
              { field: 'quantity', headerName: 'Cantidad', width: 100 },
              { field: 'reason', headerName: 'Motivo', flex: 1, minWidth: 160 },
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={false}
            data-testid="epis2-pharmacy-return-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.pharmacy.stockoutTitle} testId="epis2-pharmacy-stockout">
          <Box data-testid="epis2-pharmacy-stockout-rows">
            <DashboardHomogeneousGrid
              rows={stockoutRows}
              columns={[
                { field: 'title', headerName: 'Medicamento', flex: 1, minWidth: 160 },
                { field: 'days', headerName: 'Días hasta quiebre', width: 140 },
                { field: 'alternative', headerName: 'Alternativa', flex: 1, minWidth: 160 },
              ]}
              emptyMessage={copy.longitudinal.emptySection}
              selectable={false}
              data-testid="epis2-pharmacy-stockout-grid"
            />
          </Box>
        </EpisWorkspaceSection>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {data.demoTasks.map((task) => (
            <Chip key={task.id} label={task.label} size="small" variant="outlined" />
          ))}
        </Stack>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
