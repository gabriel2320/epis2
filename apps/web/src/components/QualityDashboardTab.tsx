import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { useState } from 'react';
import { validateHl7Message, quarantineHl7Message } from '../api/opsApi.js';
import { QualityDashboardGrids } from './QualityDashboardGrids.js';

import {
  Alert,
  Button,
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
