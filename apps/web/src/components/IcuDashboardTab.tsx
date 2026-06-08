import type { IcuDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import type { EpisDataGridRow } from '@epis2/epis2-ui';
import {
  Alert,
  Button,
  Chip,
  EpisMetric,
  EpisWorkspaceSection,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useCallback, useMemo } from 'react';
import type { EpisBulkActionMenuItem } from './actions/EpisBulkActionMenu.js';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { DashboardPanelGridSection } from './grids/DashboardPanelGridSection.js';
import { copyLinesToClipboard } from './grids/radBulkActions.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';
import { EpisRadFormSectionAccordion } from './rad/EpisRadFormSectionAccordion.js';

export type IcuDashboardTabProps = {
  data: IcuDashboardResponse;
  onOpenPatient?: (patientId: string) => void;
  onOpenHandover?: (patientId: string) => void;
  onOpenEpicrisis?: (patientId: string) => void;
};

const detailColumn: ClinicalGridColDef = {
  field: 'detail',
  headerName: copy.dashboard.gridColumnTitle,
  flex: 1,
  minWidth: 160,
};

export function IcuDashboardTab({
  data,
  onOpenPatient,
  onOpenHandover,
  onOpenEpicrisis,
}: IcuDashboardTabProps) {
  const primaryBed = data.criticalBeds.find((b) => b.patientId);

  const bedRows = useMemo(
    () =>
      data.criticalBeds.map((bed) => ({
        id: bed.bedId,
        title: `${bed.bedLabel} — ${bed.patientDisplayName ?? copy.inpatient.available}`,
        detail: bed.onVentilator
          ? `${bed.demoCaseCode ?? ''} · ${copy.icu.onVentilator}`.trim()
          : (bed.demoCaseCode ?? ''),
        patientId: bed.patientId ?? '',
      })),
    [data.criticalBeds],
  );

  const bedById = useMemo(
    () => new Map(bedRows.map((row) => [row.id, row])),
    [bedRows],
  );

  const handleBedRowClick = useCallback(
    (row: EpisDataGridRow) => {
      const patientId = String(row.patientId ?? '');
      if (patientId && onOpenPatient) onOpenPatient(patientId);
    },
    [onOpenPatient],
  );

  const bedBulkActions = useCallback(
    (selectedIds: readonly string[]): EpisBulkActionMenuItem[] => {
      const actions: EpisBulkActionMenuItem[] = [];
      if (selectedIds.length === 1 && onOpenHandover) {
        const row = bedById.get(selectedIds[0]!);
        const patientId = row?.patientId;
        if (patientId) {
          actions.push({
            id: 'handover',
            label: copy.workspaces.icu.rail.handover,
            onClick: () => onOpenHandover(patientId),
          });
        }
      }
      if (selectedIds.length >= 1 && onOpenEpicrisis) {
        actions.push({
          id: 'epicrisis',
          label: copy.icu.prepareUciDischarge,
          onClick: () => {
            const first = bedById.get(selectedIds[0]!);
            if (first?.patientId) onOpenEpicrisis(first.patientId);
          },
        });
      }
      return actions;
    },
    [bedById, onOpenEpicrisis, onOpenHandover],
  );

  const handleInvasiveRowClick = useCallback(
    (row: EpisDataGridRow) => {
      const patientId = String(row.patientId ?? '');
      if (patientId && onOpenPatient) onOpenPatient(patientId);
    },
    [onOpenPatient],
  );

  const monitoringSections = useMemo(
    () => ({
      flowsheet: data.flowsheetHours.map((row) => ({
        id: row.hourLabel,
        title: row.hourLabel,
        detail: `FC ${row.heartRate} · PAM ${row.map} · SpO₂ ${row.spo2}%`,
      })),
      hemodynamics: data.hemodynamics.map((row, index) => ({
        id: `hemo-${index}`,
        title: row.patientDisplayName,
        detail: `PAM ${row.map} · PVC ${row.cvp} · Lactato ${row.lactate.toFixed(1)}`,
      })),
      fluidBalance: data.fluidBalance.map((row) => ({
        id: row.shiftLabel,
        title: row.shiftLabel,
        detail: `${copy.icu.fluidIntake} ${row.intakeMl} mL · ${copy.icu.fluidOutput} ${row.outputMl} mL · ${row.balanceMl >= 0 ? '+' : ''}${row.balanceMl} mL`,
      })),
      ventilation: data.ventilation.map((row, index) => ({
        id: `vent-${index}`,
        title: `${row.patientDisplayName} — ${row.mode}`,
        detail: `FiO₂ ${row.fio2Percent}% · PEEP ${row.peep} · PIP ${row.pip}`,
      })),
      invasiveLines: data.invasiveLines.map((row, index) => ({
        id: `${row.patientId}-${row.lineType}-${index}`,
        title: `${row.patientDisplayName} — ${row.lineType}`,
        detail: `${row.site} · ${row.daysInPlace} d`,
        patientId: row.patientId,
      })),
      neurological: data.neurological.map((row, index) => ({
        id: `neuro-${index}`,
        title: row.patientDisplayName,
        detail: `GCS ${row.gcsTotal} · ${row.pupils} · ${row.motorResponse}`,
      })),
      severityScales: data.severityScales.map((row, index) => ({
        id: `scale-${index}`,
        title: `${row.patientDisplayName} — ${row.scaleName} ${row.score}`,
        detail: row.interpretation,
      })),
      vasoactive: data.vasoactive.map((row, index) => ({
        id: `vaso-${index}`,
        title: `${row.patientDisplayName} — ${row.agent}`,
        detail: `${row.rateMcgKgMin} mcg/kg/min · PAM objetivo ${row.mapTarget}`,
      })),
      sedoanalgesia: data.sedoanalgesia.map((row, index) => ({
        id: `sedo-${index}`,
        title: row.patientDisplayName,
        detail: `${row.sedative} · ${row.analgesic} · RASS ${row.rassScore}`,
      })),
      spontaneousVent: data.spontaneousVentTrials.map((row, index) => ({
        id: `svt-${index}`,
        title: row.patientDisplayName,
        detail: `${row.trialType} · ${row.durationMin} min · ${row.outcome}`,
      })),
      renalTherapy: data.renalTherapies.map((row, index) => ({
        id: `renal-${index}`,
        title: row.patientDisplayName,
        detail: `${row.modality} · UF ${row.ultrafiltrationMl} mL · ${row.anticoagulation}`,
      })),
      parenteralNutrition: data.parenteralNutrition.map((row, index) => ({
        id: `tpn-${index}`,
        title: row.patientDisplayName,
        detail: `${row.caloriesKcal} kcal · ${row.proteinG} g proteína · ${row.status}`,
      })),
      enteralNutrition: data.enteralNutrition.map((row, index) => ({
        id: `en-${index}`,
        title: row.patientDisplayName,
        detail: `${row.route} · ${row.rateMlH} mL/h · Residuo ${row.gastricResidualMl} mL`,
      })),
      icuDiary: data.icuDiaryEntries.map((row, index) => ({
        id: `diary-${index}`,
        title: row.patientDisplayName,
        detail: `${row.entrySummary} · ${row.authorRole}`,
      })),
      delirium: data.deliriumScreenings.map((row, index) => ({
        id: `delirium-${index}`,
        title: row.patientDisplayName,
        detail: `CAM-ICU ${row.camIcuScore} · ${row.intervention}`,
      })),
      proneProtocol: data.proneProtocols.map((row, index) => ({
        id: `prone-${index}`,
        title: row.patientDisplayName,
        detail: `${row.sessionHours} h · P/F ${row.pao2Fio2Ratio} · ${row.status}`,
      })),
    }),
    [data],
  );

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-icu-rad">
      <Stack spacing={2} data-testid="epis2-icu-dashboard">
        <Alert severity="info">{copy.icu.disclosure}</Alert>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <EpisMetric label={copy.icu.metrics.occupied} value={String(data.metrics.occupied)} />
          <EpisMetric label={copy.icu.metrics.available} value={String(data.metrics.available)} />
          <EpisMetric
            label={copy.icu.metrics.onVentilator}
            value={String(data.metrics.onVentilator)}
          />
          <EpisMetric
            label={copy.icu.metrics.netFluidBalance}
            value={`${data.metrics.netFluidBalanceMl} mL`}
            data-testid="epis2-icu-net-fluid-balance"
          />
        </Stack>

        <EpisWorkspaceSection title={copy.icu.idcPanelsTitle} testId="epis2-icu-idc-panels">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.idcPanels.map((panel) => (
              <Chip
                key={panel.idc}
                label={`IDC ${panel.idc}: ${panel.label}`}
                size="small"
                color={panel.status === 'active' ? 'error' : 'default'}
                variant={panel.status === 'active' ? 'filled' : 'outlined'}
                data-testid={`epis2-icu-idc-${panel.idc}`}
              />
            ))}
          </Stack>
        </EpisWorkspaceSection>

        <EpisWorkspaceSection
          title={copy.icu.specializedPanelsTitle}
          testId="epis2-icu-specialized-idc-panels"
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.specializedPanels.map((panel) => (
              <Chip
                key={panel.idc}
                label={`IDC ${panel.idc}: ${panel.label}`}
                size="small"
                color={panel.status === 'active' ? 'error' : 'default'}
                variant={panel.status === 'active' ? 'filled' : 'outlined'}
                data-testid={`epis2-icu-idc-${panel.idc}`}
              />
            ))}
          </Stack>
        </EpisWorkspaceSection>

        <EpisWorkspaceSection title={copy.icu.bedMapTitle} testId="epis2-icu-bed-map">
          <DashboardHomogeneousGrid
            rows={bedRows}
            columns={[
              { field: 'title', headerName: copy.icu.bedMapTitle, flex: 1, minWidth: 200 },
              detailColumn,
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            onRowClick={handleBedRowClick}
            onCopySelection={copyLinesToClipboard}
            extraBulkActions={bedBulkActions}
            data-testid="epis2-icu-bed-map-grid"
          />
        </EpisWorkspaceSection>

        <EpisRadFormSectionAccordion
          id="icu-monitoring-panels"
          title={copy.workspaces.icu.rail.monitoring}
          testId="epis2-icu-monitoring-accordion"
        >
          <Stack spacing={2}>
            <DashboardPanelGridSection
              title={copy.icu.flowsheetTitle}
              testId="epis2-icu-flowsheet"
              rows={monitoringSections.flowsheet}
            />
            <DashboardPanelGridSection
              title={copy.icu.hemodynamicsTitle}
              testId="epis2-icu-hemodynamics"
              rows={monitoringSections.hemodynamics}
            />
            <DashboardPanelGridSection
              title={copy.icu.fluidBalanceTitle}
              testId="epis2-icu-fluid-balance"
              rows={monitoringSections.fluidBalance}
            />
            <DashboardPanelGridSection
              title={copy.icu.ventilationTitle}
              testId="epis2-icu-ventilation"
              rows={monitoringSections.ventilation}
            />
            <DashboardPanelGridSection
              title={copy.icu.invasiveLinesTitle}
              testId="epis2-icu-invasive-lines"
              rows={monitoringSections.invasiveLines}
              onRowClick={handleInvasiveRowClick}
              titleHeader={copy.dashboard.gridColumnPatient}
            />
            <DashboardPanelGridSection
              title={copy.icu.neurologicalTitle}
              testId="epis2-icu-neurological"
              rows={monitoringSections.neurological}
            />
            <DashboardPanelGridSection
              title={copy.icu.severityScalesTitle}
              testId="epis2-icu-severity-scales"
              rows={monitoringSections.severityScales}
            />
            <DashboardPanelGridSection
              title={copy.icu.vasoactiveTitle}
              testId="epis2-icu-vasoactive"
              rows={monitoringSections.vasoactive}
            />
            <DashboardPanelGridSection
              title={copy.icu.sedoanalgesiaTitle}
              testId="epis2-icu-sedoanalgesia"
              rows={monitoringSections.sedoanalgesia}
            />
            <DashboardPanelGridSection
              title={copy.icu.spontaneousVentTitle}
              testId="epis2-icu-spontaneous-vent"
              rows={monitoringSections.spontaneousVent}
              emptyFallback={copy.icu.noSpecializedCases}
            />
            <DashboardPanelGridSection
              title={copy.icu.renalTherapyTitle}
              testId="epis2-icu-renal-therapy"
              rows={monitoringSections.renalTherapy}
            />
            <DashboardPanelGridSection
              title={copy.icu.parenteralNutritionTitle}
              testId="epis2-icu-parenteral-nutrition"
              rows={monitoringSections.parenteralNutrition}
            />
            <DashboardPanelGridSection
              title={copy.icu.enteralNutritionTitle}
              testId="epis2-icu-enteral-nutrition"
              rows={monitoringSections.enteralNutrition}
            />
            <EpisWorkspaceSection title={copy.icu.brainDeathTitle} testId="epis2-icu-brain-death">
              <Typography variant="body2" color="text.secondary">
                {data.brainDeathChecklists.length === 0
                  ? copy.icu.noSpecializedCases
                  : data.brainDeathChecklists.map((r) => r.patientDisplayName).join(', ')}
              </Typography>
            </EpisWorkspaceSection>
            <EpisWorkspaceSection
              title={copy.icu.organProcurementTitle}
              testId="epis2-icu-organ-procurement"
            >
              <Typography variant="body2" color="text.secondary">
                {copy.icu.noSpecializedCases}
              </Typography>
            </EpisWorkspaceSection>
            <DashboardPanelGridSection
              title={copy.icu.icuDiaryTitle}
              testId="epis2-icu-diary"
              rows={monitoringSections.icuDiary}
            />
            <DashboardPanelGridSection
              title={copy.icu.deliriumTitle}
              testId="epis2-icu-delirium"
              rows={monitoringSections.delirium}
            />
            <DashboardPanelGridSection
              title={copy.icu.proneProtocolTitle}
              testId="epis2-icu-prone-protocol"
              rows={monitoringSections.proneProtocol}
              emptyFallback={copy.icu.noSpecializedCases}
            />
          </Stack>
        </EpisRadFormSectionAccordion>

        {primaryBed?.patientId && onOpenHandover ? (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onOpenHandover(primaryBed.patientId!)}
            data-testid="epis2-icu-open-handover"
          >
            {copy.workspaces.icu.rail.handover}
          </Button>
        ) : null}
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
