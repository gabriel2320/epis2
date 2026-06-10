import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  Alert,
  Button,
  Chip,
  EpisMetric,
  EpisWorkspaceSection,
  Stack,
  TextField,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';
import { validateHl7Message, quarantineHl7Message } from '../api/opsApi.js';
import { DashboardPanelGridSection } from './grids/DashboardPanelGridSection.js';
import { buildQualityDashboardGridRows } from './quality/qualityDashboardRowMaps.js';
import { EpisRadDashboardTabShell } from './rad/EpisRadDashboardTabShell.js';
import { EpisRadFormSectionAccordion } from './rad/EpisRadFormSectionAccordion.js';

export type QualityDashboardTabProps = {
  data: QualityDashboardResponse;
};

export function QualityDashboardTab({ data }: QualityDashboardTabProps) {
  const [hl7, setHl7] = useState('MSH|^~\\&|EPIS2|LAB|20260101120000||ADT^A01|1|P|2.5');
  const [hl7Result, setHl7Result] = useState<string | null>(null);
  const [quarantineResult, setQuarantineResult] = useState<string | null>(null);

  const rows = useMemo(() => buildQualityDashboardGridRows(data), [data]);

  const runHl7 = async () => {
    try {
      const res = await validateHl7Message(hl7);
      setHl7Result(
        res.valid
          ? `${copy.interop.hl7Valid}${res.messageType ? ` (${res.messageType})` : ''}`
          : `${copy.interop.hl7Invalid}: ${res.errors.join('; ')}`,
      );
    } catch {
      setHl7Result(copy.errors.genericMessage);
    }
  };

  const runQuarantine = async () => {
    try {
      const res = await quarantineHl7Message(hl7);
      setQuarantineResult(
        `Cuarentena ${res.quarantineId.slice(0, 8)}… (${res.messageType ?? 'HL7'})`,
      );
    } catch {
      setQuarantineResult(copy.errors.genericMessage);
    }
  };

  return (
    <EpisRadDashboardTabShell testId="epis2-dashboard-quality-rad">
      <Stack spacing={2} data-testid="epis2-dashboard-quality">
        <Typography variant="h6">{copy.dashboard.tabQuality}</Typography>
        <Alert severity="info">{copy.interop.fhirExportHint}</Alert>

        <EpisWorkspaceSection title={copy.interop.metricsTitle}>
          <Typography variant="body2" color="text.secondary">
            {copy.interop.schemaVersion}: {data.ops.schemaVersion ?? '—'}
          </Typography>
          <Typography variant="body2">
            {copy.interop.metricPatients}: {data.ops.counts.patients} ·{' '}
            {copy.interop.metricOpenDrafts}: {data.metrics.openDrafts} ·{' '}
            {copy.interop.metricApprovedNotes}: {data.metrics.approvedNotes}
          </Typography>
          <Typography variant="body2">
            {copy.interop.metricAudit24h}: {data.ops.counts.auditEvents24h} ·{' '}
            {copy.interop.metricAiRuns}: {data.metrics.aiRuns} ·{' '}
            {copy.interop.metricCriticalUnacked}: {data.metrics.criticalUnacked}
          </Typography>
        </EpisWorkspaceSection>

        <Alert severity="info">{copy.qualityAudit.disclosure}</Alert>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <EpisMetric
            label={copy.qualityAudit.metrics.activeModules}
            value={String(data.qualityAuditMetrics.activeQualityModules)}
          />
          <EpisMetric
            label={copy.qualityAudit.metrics.openSentinel}
            value={String(data.qualityAuditMetrics.openSentinelEvents)}
          />
          <EpisMetric
            label={copy.qualityAudit.metrics.pendingAccreditation}
            value={String(data.qualityAuditMetrics.pendingAccreditationReviews)}
          />
        </Stack>

        <EpisWorkspaceSection
          title={copy.qualityAudit.idcPanelsTitle}
          testId="epis2-quality-idc-panels"
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.qualityAuditPanels.map((panel) => (
              <Chip
                key={panel.idc}
                label={`IDC ${panel.idc}: ${panel.label}`}
                size="small"
                color={panel.status === 'active' ? 'primary' : 'default'}
                variant={panel.status === 'active' ? 'filled' : 'outlined'}
                data-testid={`epis2-quality-idc-${panel.idc}`}
              />
            ))}
          </Stack>
        </EpisWorkspaceSection>

        <DashboardPanelGridSection
          title={copy.qualityAudit.sentinelTitle}
          testId="epis2-quality-sentinel"
          rows={rows.sentinel}
          titleHeader={copy.interop.gridColumnEvent}
        />

        <EpisRadFormSectionAccordion
          id="quality-audit-secondary"
          title={copy.qualityAudit.rcaTitle}
          testId="epis2-quality-audit-accordion"
        >
          <Stack spacing={2}>
            <DashboardPanelGridSection
              title={copy.qualityAudit.rcaTitle}
              testId="epis2-quality-rca"
              rows={rows.rootCause}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.mortalityBoardTitle}
              testId="epis2-quality-mortality-board"
              rows={rows.mortalityBoard}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.recordAuditTitle}
              testId="epis2-quality-record-audit"
              rows={rows.recordAudit}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.oirsTitle}
              testId="epis2-quality-oirs"
              rows={rows.oirs}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.workClimateTitle}
              testId="epis2-quality-work-climate"
              rows={rows.workClimate}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.consentTraceTitle}
              testId="epis2-quality-consent-trace"
              rows={rows.consent}
              titleHeader={copy.dashboard.gridColumnPatient}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.accreditationTitle}
              testId="epis2-quality-accreditation"
              rows={rows.accreditation}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.institutionalDocsTitle}
              testId="epis2-quality-institutional-docs"
              rows={rows.institutionalDocs}
            />
            <DashboardPanelGridSection
              title={copy.qualityAudit.surgicalSuspensionTitle}
              testId="epis2-quality-surgical-suspension"
              rows={rows.surgicalSuspension}
            />
          </Stack>
        </EpisRadFormSectionAccordion>

        <EpisWorkspaceSection
          title={copy.iaas.advancedPanelsTitle}
          testId="epis2-iaas-advanced-idc-panels"
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {data.iaasAdvancedPanels.map((panel) => (
              <Chip
                key={panel.idc}
                label={`IDC ${panel.idc}: ${panel.label}`}
                size="small"
                color={panel.status === 'active' ? 'secondary' : 'default'}
                variant={panel.status === 'active' ? 'filled' : 'outlined'}
                data-testid={`epis2-iaas-idc-${panel.idc}`}
              />
            ))}
          </Stack>
        </EpisWorkspaceSection>

        <DashboardPanelGridSection
          title={copy.iaas.surveillanceMatrixTitle}
          testId="epis2-iaas-surveillance-matrix"
          rows={rows.surveillance}
        />

        <EpisRadFormSectionAccordion
          id="quality-iaas-secondary"
          title={copy.iaas.mdroAlertTitle}
          testId="epis2-quality-iaas-accordion"
        >
          <Stack spacing={2}>
            <DashboardPanelGridSection
              title={copy.iaas.mdroAlertTitle}
              testId="epis2-iaas-mdro-alert"
              rows={rows.mdro}
              titleHeader={copy.dashboard.gridColumnPatient}
            />
            <DashboardPanelGridSection
              title={copy.iaas.antimicrobialMonitorTitle}
              testId="epis2-iaas-antimicrobial-monitor"
              rows={rows.antimicrobial}
            />
            <DashboardPanelGridSection
              title={copy.iaas.proaTitle}
              testId="epis2-iaas-proa"
              rows={rows.proa}
              titleHeader={copy.dashboard.gridColumnPatient}
            />
            <DashboardPanelGridSection
              title={copy.iaas.cvcChecklistTitle}
              testId="epis2-iaas-cvc-checklist"
              rows={rows.cvc}
              titleHeader={copy.dashboard.gridColumnPatient}
            />
            <DashboardPanelGridSection
              title={copy.iaas.navPreventionTitle}
              testId="epis2-iaas-nav-prevention"
              rows={rows.nav}
            />
            <DashboardPanelGridSection
              title={copy.iaas.handHygieneTitle}
              testId="epis2-iaas-hand-hygiene"
              rows={rows.handHygiene}
            />
            <DashboardPanelGridSection
              title={copy.iaas.outbreakStudyTitle}
              testId="epis2-iaas-outbreak-study"
              rows={rows.outbreak}
            />
            <DashboardPanelGridSection
              title={copy.iaas.isolationMapTitle}
              testId="epis2-iaas-isolation-map"
              rows={rows.isolation}
              titleHeader={copy.dashboard.gridColumnPatient}
            />
            <DashboardPanelGridSection
              title={copy.iaas.endemicCurvesTitle}
              testId="epis2-iaas-endemic-curves"
              rows={rows.endemic}
            />
          </Stack>
        </EpisRadFormSectionAccordion>

        <DashboardPanelGridSection
          title={copy.interop.stagingTitle}
          testId="epis2-quality-staging"
          rows={rows.staging}
          titleHeader={copy.interop.gridColumnBatch}
        />

        <DashboardPanelGridSection
          title={copy.interop.auditTitle}
          testId="epis2-quality-audit"
          rows={rows.audit}
          titleHeader={copy.interop.gridColumnEvent}
        />

        <EpisWorkspaceSection title={copy.interop.hl7Validate}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            value={hl7}
            onChange={(e) => setHl7(e.target.value)}
            placeholder={copy.interop.hl7Placeholder}
          />
          <Button
            size="small"
            sx={{ mt: 1 }}
            variant="outlined"
            onClick={() => void runHl7()}
            data-testid="epis2-hl7-validate-run"
          >
            {copy.interop.hl7Validate}
          </Button>
          <Button
            size="small"
            sx={{ mt: 1, ml: 1 }}
            variant="contained"
            onClick={() => void runQuarantine()}
            data-testid="epis2-hl7-quarantine-run"
          >
            Cuarentena HL7
          </Button>
          {hl7Result ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {hl7Result}
            </Typography>
          ) : null}
          {quarantineResult ? (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {quarantineResult}
            </Typography>
          ) : null}
        </EpisWorkspaceSection>
      </Stack>
    </EpisRadDashboardTabShell>
  );
}
