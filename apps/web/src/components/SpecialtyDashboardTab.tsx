import type { SpecialtyDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import type { ClinicalGridColDef } from '@epis2/clinical-productivity';
import { Alert, Chip, EpisMetric, EpisWorkspaceSection, Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { DashboardHomogeneousGrid } from './grids/DashboardHomogeneousGrid.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';
import { EpisRadFormSectionAccordion } from './rad/EpisRadFormSectionAccordion.js';

export type SpecialtyDashboardTabProps = {
  data: SpecialtyDashboardResponse;
};

function listToGridRows(
  items: readonly { key: string; title: string; detail: string }[],
): { id: string; title: string; detail: string }[] {
  return items.map((item) => ({ id: item.key, title: item.title, detail: item.detail }));
}

const detailColumn: ClinicalGridColDef = {
  field: 'detail',
  headerName: copy.dashboard.gridColumnTitle,
  flex: 1,
  minWidth: 160,
};

export function SpecialtyDashboardTab({ data }: SpecialtyDashboardTabProps) {
  const partogramRows = useMemo(
    () =>
      data.partograms.map((row, index) => ({
        id: `partogram-${index}`,
        title: row.patientDisplayName,
        detail: `${row.cervicalDilationCm} cm · estación ${row.fetalStation} · ${row.updatedAt}`,
      })),
    [data.partograms],
  );

  const oncologyRows = useMemo(
    () =>
      data.oncologyBoardCases.map((row, index) => ({
        id: `oncology-${index}`,
        title: row.patientDisplayName,
        detail: `${row.tumorType} · ${row.discussionDate} · ${row.recommendation}`,
      })),
    [data.oncologyBoardCases],
  );

  const secondaryPanels = useMemo(
    () =>
      listToGridRows([
        ...data.odontograms.map((row, index) => ({
          key: `odonto-${index}`,
          title: row.patientDisplayName,
          detail: `Piezas ${row.teethAffected} · ${row.conditionSummary}`,
        })),
        ...data.endoscopyReports.map((row, index) => ({
          key: `endo-${index}`,
          title: `${row.patientDisplayName} — ${row.procedure}`,
          detail: row.keyFinding,
        })),
        ...data.ophthalmologyEvaluations.map((row, index) => ({
          key: `oph-${index}`,
          title: row.patientDisplayName,
          detail: `AV ${row.visualAcuity} · PIO ${row.iopMmHg} mmHg`,
        })),
        ...data.hemodialysisSessions.map((row, index) => ({
          key: `hd-${index}`,
          title: row.patientDisplayName,
          detail: `${row.sessionHours} h · UF ${row.ultrafiltrationMl} mL`,
        })),
        ...data.kinesiologyRecords.map((row, index) => ({
          key: `kine-${index}`,
          title: `${row.patientDisplayName} — ${row.joint}`,
          detail: `ROM ${row.romDegrees}°`,
        })),
        ...data.nutritionRecords.map((row, index) => ({
          key: `nutr-${index}`,
          title: row.patientDisplayName,
          detail: `IMC ${row.bmi} · ${row.planStatus}`,
        })),
        ...data.chemotherapyProtocols.map((row, index) => ({
          key: `chemo-${index}`,
          title: row.patientDisplayName,
          detail: `${row.protocol} · día ${row.cycleDay}`,
        })),
        ...data.psychiatryFollowups.map((row, index) => ({
          key: `psych-${index}`,
          title: row.patientDisplayName,
          detail: `${row.scaleName} ${row.score}`,
        })),
      ]),
    [data],
  );

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-specialty-rad">
      <Stack spacing={2} data-testid="epis2-specialty-dashboard">
        <Alert severity="info">{copy.specialty.disclosure}</Alert>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <EpisMetric
            label={copy.specialty.metrics.activeModules}
            value={String(data.metrics.activeSpecialtyModules)}
          />
          <EpisMetric
            label={copy.specialty.metrics.pendingReviews}
            value={String(data.metrics.pendingGraphicReviews)}
          />
          <EpisMetric
            label={copy.specialty.metrics.scheduledBoards}
            value={String(data.metrics.scheduledBoards)}
          />
        </Stack>

        <EpisWorkspaceSection
          title={copy.specialty.idcPanelsTitle}
          testId="epis2-specialty-idc-panels"
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.idcPanels.map((panel) => (
              <Chip
                key={panel.idc}
                label={`IDC ${panel.idc}: ${panel.label}`}
                size="small"
                color={panel.status === 'active' ? 'primary' : 'default'}
                variant={panel.status === 'active' ? 'filled' : 'outlined'}
                data-testid={`epis2-specialty-idc-${panel.idc}`}
              />
            ))}
          </Stack>
        </EpisWorkspaceSection>

        <EpisWorkspaceSection
          title={copy.specialty.partogramTitle}
          testId="epis2-specialty-partogram"
        >
          <DashboardHomogeneousGrid
            rows={partogramRows}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 160,
              },
              detailColumn,
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={partogramRows.length > 1}
            data-testid="epis2-specialty-partogram-grid"
          />
        </EpisWorkspaceSection>

        <EpisWorkspaceSection
          title={copy.specialty.oncologyBoardTitle}
          testId="epis2-specialty-oncology-board"
        >
          <DashboardHomogeneousGrid
            rows={oncologyRows}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 160,
              },
              detailColumn,
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={oncologyRows.length > 1}
            data-testid="epis2-specialty-oncology-grid"
          />
        </EpisWorkspaceSection>

        <EpisRadFormSectionAccordion
          id="specialty-secondary-panels"
          title={copy.specialty.odontogramTitle}
          testId="epis2-specialty-secondary-accordion"
        >
          <DashboardHomogeneousGrid
            rows={secondaryPanels}
            columns={[
              {
                field: 'title',
                headerName: copy.dashboard.gridColumnPatient,
                flex: 1,
                minWidth: 160,
              },
              detailColumn,
            ]}
            emptyMessage={copy.longitudinal.emptySection}
            selectable={secondaryPanels.length > 1}
            data-testid="epis2-specialty-secondary-grid"
          />
        </EpisRadFormSectionAccordion>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
