import type { AiRunRow, RagQueryResponse, AiSummarySuggestResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchAiRuns,
  fetchAiStatus,
  queryPatientRag,
  suggestPatientSummary,
} from '../api/aiApi.js';

export type PatientClinicalAiPanelProps = {
  patientId: string;
};

export function PatientClinicalAiPanel({ patientId }: PatientClinicalAiPanelProps) {
  const [aiUp, setAiUp] = useState<boolean | null>(null);
  const [question, setQuestion] = useState('laboratorio');
  const [ragResult, setRagResult] = useState<RagQueryResponse | null>(null);
  const [summaryResult, setSummaryResult] = useState<AiSummarySuggestResponse | null>(null);
  const [runs, setRuns] = useState<AiRunRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refreshRuns = useCallback(async () => {
    try {
      const res = await fetchAiRuns(patientId);
      setRuns(res.runs.slice(0, 5));
    } catch {
      setRuns([]);
    }
  }, [patientId]);

  useEffect(() => {
    void fetchAiStatus()
      .then((s) => setAiUp(s.available))
      .catch(() => setAiUp(false));
    void refreshRuns();
  }, [refreshRuns]);

  const runRag = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await queryPatientRag(patientId, question);
      setRagResult(res);
      await refreshRuns();
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  };

  const runSummary = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await suggestPatientSummary(patientId);
      setSummaryResult(res);
      await refreshRuns();
    } catch {
      setError(copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }} data-testid="epis2-patient-ai-panel">
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="subtitle2">{copy.ai.panelTitle}</Typography>
          <Chip
            size="small"
            label={aiUp === null ? '…' : aiUp ? copy.ai.statusOn : copy.ai.statusOff}
            color={aiUp ? 'success' : 'default'}
            variant="outlined"
          />
        </Stack>
        <Alert severity="info">{copy.ai.humanReviewRequired}</Alert>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <Box>
          <Typography variant="body2" gutterBottom>
            {copy.ai.ragTitle}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={copy.ai.ragPlaceholder}
          />
          <Button size="small" sx={{ mt: 1 }} variant="outlined" disabled={loading} onClick={() => void runRag()}>
            {copy.ai.ragSubmit}
          </Button>
          {ragResult ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {ragResult.answer}
              </Typography>
              {ragResult.citations.length > 0 ? (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  {copy.ai.citations}:{' '}
                  {ragResult.citations.map((c) => c.title).join(' · ')}
                </Typography>
              ) : null}
            </Box>
          ) : null}
        </Box>

        <Box>
          <Button size="small" variant="outlined" disabled={loading} onClick={() => void runSummary()}>
            {copy.ai.summary24h}
          </Button>
          {summaryResult ? (
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
              {summaryResult.summaryText}
            </Typography>
          ) : null}
        </Box>

        {runs.length > 0 ? (
          <Box>
            <Typography variant="caption" color="text.secondary">
              {copy.ai.recentRuns}
            </Typography>
            {runs.map((r) => (
              <Typography key={r.id} variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
                {new Date(r.createdAt).toLocaleString('es-CL')} · {r.blueprintId} · {r.status}
              </Typography>
            ))}
          </Box>
        ) : null}
      </Stack>
    </Paper>
  );
}
