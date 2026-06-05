import { copy } from '@epis2/design-system';

import {
  Box,
  Paper,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
const FIELD_LABELS: Record<string, string> = {
  activeProblems: copy.activePatient.summaryActiveProblems,
  recentEvents: copy.activePatient.summaryRecentEvents,
  relevantLabs: copy.activePatient.summaryLabs,
  activeMedications: copy.activePatient.summaryMedications,
  pendingItems: copy.activePatient.summaryPending,
  clinicalAlerts: copy.activePatient.summaryAlerts,
};

export type PatientClinicalSummaryPanelProps = {
  summaryFields: Record<string, string>;
};

export function PatientClinicalSummaryPanel({
  summaryFields,
}: PatientClinicalSummaryPanelProps) {
  const entries = Object.entries(summaryFields).filter(([, v]) => v.trim());
  if (entries.length === 0) return null;

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, width: '100%' }}
      data-testid="epis2-clinical-summary"
    >
      <Typography variant="subtitle2" gutterBottom>
        {copy.activePatient.clinicalContextTitle}
      </Typography>
      <Stack spacing={1.5}>
        {entries.map(([key, value]) => (
          <Box key={key}>
            <Typography variant="body2" color="text.secondary" display="block" sx={{ lineHeight: 1.55 }}>
              {FIELD_LABELS[key] ?? key}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
