import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { useState } from 'react';
import { validateHl7Message, quarantineHl7Message } from '../api/opsApi.js';
import { QualityDashboardGrids } from './QualityDashboardGrids.js';

import {
  Alert,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
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

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.interop.metricsTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-advanced-idc-panels">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.advancedPanelsTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-surveillance-matrix">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.surveillanceMatrixTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-mdro-alert">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.mdroAlertTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-antimicrobial-monitor">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.antimicrobialMonitorTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-proa">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.proaTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-cvc-checklist">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.cvcChecklistTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-nav-prevention">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.navPreventionTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-hand-hygiene">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.handHygieneTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-outbreak-study">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.outbreakStudyTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-isolation-map">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.isolationMapTitle}
        </Typography>
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
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-iaas-endemic-curves">
        <Typography variant="subtitle2" gutterBottom>
          {copy.iaas.endemicCurvesTitle}
        </Typography>
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
      </Paper>

      <QualityDashboardGrids data={data} />

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {copy.interop.hl7Validate}
        </Typography>
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
      </Paper>
    </Stack>
  );
}
