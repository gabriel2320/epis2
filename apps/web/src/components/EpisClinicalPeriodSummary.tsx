import { copy } from '@epis2/design-system';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  EpisAiDisclosure,
  EpisButton,
  ExpandMoreIcon,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useState } from 'react';
import { suggestPatientSummary } from '../api/aiApi.js';

export type EpisClinicalPeriodSummaryProps = {
  patientId: string;
};

/** Resumen de periodo bajo demanda — colapsable, con disclosure IA (LAYOUT-03). */
export function EpisClinicalPeriodSummary({ patientId }: EpisClinicalPeriodSummaryProps) {
  const [loading, setLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | undefined>();
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const loadSummary = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await suggestPatientSummary(patientId);
      setSummaryText(res.summaryText);
      setExpanded(true);
    } catch {
      setError(copy.clinicalLayout.periodSummaryError);
      setSummaryText(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1} data-testid="epis2-period-summary">
      <EpisButton
        variant="outlined"
        size="small"
        disabled={loading}
        onClick={() => void loadSummary()}
        data-testid="epis2-period-summary-action"
      >
        {loading ? copy.clinicalLayout.periodSummaryLoading : copy.clinicalLayout.periodSummaryAction}
      </EpisButton>
      {error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : null}
      {summaryText ? (
        <Accordion
          expanded={expanded}
          onChange={(_, open) => setExpanded(open)}
          disableGutters
          elevation={0}
          sx={{ border: 1, borderColor: 'divider', borderRadius: 1, '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
            <Typography variant="body2">{copy.clinicalLayout.periodSummaryTitle}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              <EpisAiDisclosure />
              <Typography
                variant="body2"
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55, m: 0, fontFamily: 'inherit' }}
              >
                {summaryText}
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : null}
    </Stack>
  );
}
