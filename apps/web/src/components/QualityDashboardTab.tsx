import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { useState } from 'react';
import { validateHl7Message, quarantineHl7Message } from '../api/opsApi.js';
import { QualityDashboardGrids } from './QualityDashboardGrids.js';

import { EpisWorkspaceSection,
  Alert,
  Button,
  Chip,
  EpisMetric,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@epis2/epis2-ui';
export type QualityDashboardTabProps = {
  data: QualityDashboardResponse;
};

export function QualityDashboardTab({ data }: QualityDashboardTabProps) {
  const [hl7, setHl7] = useState('MSH|^~\\&|EPIS2|LAB|20260101120000||ADT^A01|1|P|2.5');
  const [hl7Result, setHl7Result] = useState<string | null>(null);
  const [quarantineResult, setQuarantineResult] = useState<string | null>(null);

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
      setQuarantineResult(`Cuarentena ${res.quarantineId.slice(0, 8)}… (${res.messageType ?? 'HL7'})`);
    } catch {
      setQuarantineResult(copy.errors.genericMessage);
    }
  };

  return (
    <Stack spacing={2} data-testid="epis2-dashboard-quality">
      <Typography variant="h6">{copy.dashboard.tabQuality}</Typography>
      <Alert severity="info">{copy.interop.fhirExportHint}</Alert>

      <EpisWorkspaceSection title={copy.interop.metricsTitle}>
        <Typography variant="body2" color="text.secondary">
          {copy.interop.schemaVersion}: {data.ops.schemaVersion ?? '—'}
        </Typography>
        <Typography variant="body2">
          {copy.interop.metricPatients}: {data.ops.counts.patients} · {copy.interop.metricOpenDrafts}:{' '}
          {data.metrics.openDrafts} · {copy.interop.metricApprovedNotes}: {data.metrics.approvedNotes}
        </Typography>
        <Typography variant="body2">
          {copy.interop.metricAudit24h}: {data.ops.counts.auditEvents24h} · {copy.interop.metricAiRuns}:{' '}
          {data.metrics.aiRuns} · {copy.interop.metricCriticalUnacked}: {data.metrics.criticalUnacked}
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

      <EpisWorkspaceSection title={copy.qualityAudit.idcPanelsTitle} testId="epis2-quality-idc-panels">
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

      <EpisWorkspaceSection title={copy.qualityAudit.sentinelTitle} testId="epis2-quality-sentinel">
        <List dense data-testid="epis2-quality-sentinel-rows">
          {data.sentinelEvents.map((row) => (
            <ListItem key={row.eventCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.eventCode} — ${row.unit}`}
                secondary={`${row.severity} · ${row.status} · ${row.reportedAt}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.rcaTitle} testId="epis2-quality-rca">
        <List dense>
          {data.rootCauseAnalyses.map((row) => (
            <ListItem key={row.caseCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.caseCode} — ${row.eventSummary}`}
                secondary={`${row.leadInvestigator} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.mortalityBoardTitle} testId="epis2-quality-mortality-board">
        <List dense>
          {data.mortalityBoardCases.map((row) => (
            <ListItem key={row.caseCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.caseCode} — ${row.patientInitials}`}
                secondary={`${row.reviewDate} · ${row.recommendation}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.recordAuditTitle} testId="epis2-quality-record-audit">
        <List dense>
          {data.recordAudits.map((row) => (
            <ListItem key={row.recordType} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.recordType}
                secondary={`n=${row.sampleSize} · ${row.compliancePercent}% · ${row.auditor}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.oirsTitle} testId="epis2-quality-oirs">
        <List dense>
          {data.oirsClaims.map((row) => (
            <ListItem key={row.claimId} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.claimId} — ${row.category}`}
                secondary={`${row.daysOpen} días · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.workClimateTitle} testId="epis2-quality-work-climate">
        <List dense>
          {data.workClimateSurveys.map((row) => (
            <ListItem key={row.unit} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.unit}
                secondary={`respuesta ${row.responseRatePercent}% · engagement ${row.engagementScore} · ${row.surveyPeriod}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.consentTraceTitle} testId="epis2-quality-consent-trace">
        <List dense>
          {data.consentTraces.map((row) => (
            <ListItem key={`${row.patientDisplayName}-${row.consentType}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.patientDisplayName} — ${row.consentType}`}
                secondary={`${row.signedAt} · ${row.traceStatus}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.accreditationTitle} testId="epis2-quality-accreditation">
        <List dense data-testid="epis2-quality-accreditation-rows">
          {data.accreditationIndicators.map((row) => (
            <ListItem key={row.indicatorCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.indicatorCode} — ${row.indicatorName}`}
                secondary={`meta ${row.targetPercent}% · observado ${row.observedPercent}%`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.institutionalDocsTitle} testId="epis2-quality-institutional-docs">
        <List dense>
          {data.institutionalDocuments.map((row) => (
            <ListItem key={row.documentCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.documentCode} — ${row.title}`}
                secondary={`${row.version} · revisión ${row.reviewDue}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.qualityAudit.surgicalSuspensionTitle} testId="epis2-quality-surgical-suspension">
        <List dense data-testid="epis2-quality-surgical-suspension-rows">
          {data.surgicalSuspensions.map((row) => (
            <ListItem key={row.caseCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.caseCode} — ${row.operatingRoom}`}
                secondary={`${row.reason} · ${row.suspendedAt}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.advancedPanelsTitle} testId="epis2-iaas-advanced-idc-panels">
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

      <EpisWorkspaceSection title={copy.iaas.surveillanceMatrixTitle} testId="epis2-iaas-surveillance-matrix">
        <List dense data-testid="epis2-iaas-surveillance-matrix-rows">
          {data.surveillanceMatrix.map((row) => (
            <ListItem key={`${row.organism}-${row.unit}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.organism} — ${row.unit}`}
                secondary={`${row.casesLast30d} casos/30d · ${row.alertLevel}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.mdroAlertTitle} testId="epis2-iaas-mdro-alert">
        <List dense>
          {data.mdroAlerts.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.organism} · ${row.isolationType}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.antimicrobialMonitorTitle} testId="epis2-iaas-antimicrobial-monitor">
        <List dense>
          {data.antimicrobialConsumption.map((row) => (
            <ListItem key={row.antibiotic} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.antibiotic}
                secondary={`DDD/1000 ${row.dddPer1000} · ${row.trend}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.proaTitle} testId="epis2-iaas-proa">
        <List dense>
          {data.proaRecommendations.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.currentRegimen} → ${row.recommendation} · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.cvcChecklistTitle} testId="epis2-iaas-cvc-checklist">
        <List dense>
          {data.cvcInsertionChecklists.map((row) => (
            <ListItem key={row.patientDisplayName} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.patientDisplayName}
                secondary={`${row.insertionSite} · bundle ${row.bundleCompliance}%`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.navPreventionTitle} testId="epis2-iaas-nav-prevention">
        <List dense>
          {data.navPreventionChecklists.map((row) => (
            <ListItem key={row.unit} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.unit}
                secondary={`${row.ventilatorDays} días VM · bundle ${row.bundleCompliancePercent}%`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.handHygieneTitle} testId="epis2-iaas-hand-hygiene">
        <List dense>
          {data.handHygieneAudits.map((row) => (
            <ListItem key={row.unit} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.unit}
                secondary={`${row.compliancePercent}% · ${row.opportunities} oportunidades · ${row.auditDate}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.outbreakStudyTitle} testId="epis2-iaas-outbreak-study">
        <List dense>
          {data.outbreakStudies.map((row) => (
            <ListItem key={row.outbreakCode} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.outbreakCode} — ${row.unit}`}
                secondary={`${row.cases} casos · ${row.status}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.isolationMapTitle} testId="epis2-iaas-isolation-map">
        <List dense data-testid="epis2-iaas-isolation-map-rows">
          {data.isolationMap.map((row) => (
            <ListItem key={`${row.bedLabel}-${row.patientDisplayName}`} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={`${row.bedLabel} — ${row.patientDisplayName}`}
                secondary={row.precautionType}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <EpisWorkspaceSection title={copy.iaas.endemicCurvesTitle} testId="epis2-iaas-endemic-curves">
        <List dense data-testid="epis2-iaas-endemic-curves-rows">
          {data.endemicCurves.map((row) => (
            <ListItem key={row.indicator} disablePadding sx={{ py: 0.25 }}>
              <ListItemText
                primary={row.indicator}
                secondary={`endémico ${row.endemicRate} · observado ${row.observedRate} · ${row.periodLabel}`}
              />
            </ListItem>
          ))}
        </List>
      </EpisWorkspaceSection>

      <QualityDashboardGrids data={data} />

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
  );
}
