import type { QualityDashboardResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { useState } from 'react';
import { validateHl7Message } from '../api/opsApi.js';
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
          Pacientes: {data.ops.counts.patients} · Borradores abiertos: {data.metrics.openDrafts} · Notas
          aprobadas: {data.metrics.approvedNotes}
        </Typography>
        <Typography variant="body2">
          Auditoría 24 h: {data.ops.counts.auditEvents24h} · IA runs: {data.metrics.aiRuns} · Críticos
          sin acuse: {data.metrics.criticalUnacked}
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
        <Button size="small" sx={{ mt: 1 }} variant="outlined" onClick={() => void runHl7()}>
          {copy.interop.hl7Validate}
        </Button>
        {hl7Result ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {hl7Result}
          </Typography>
        ) : null}
      </Paper>
    </Stack>
  );
}
