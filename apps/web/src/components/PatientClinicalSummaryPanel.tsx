import { copy } from '@epis2/design-system';
import { Box, EpisWorkspaceSection, Stack, Typography } from '@epis2/epis2-ui';
import { patientSummaryFieldLabel } from '../clinical/patientSummaryFieldLabels.js';

export type PatientClinicalSummaryPanelProps = {
  summaryFields: Record<string, string>;
};

export function PatientClinicalSummaryPanel({ summaryFields }: PatientClinicalSummaryPanelProps) {
  const entries = Object.entries(summaryFields).filter(([, v]) => v.trim());
  if (entries.length === 0) return null;

  return (
    <EpisWorkspaceSection
      title={copy.activePatient.clinicalContextTitle}
      testId="epis2-clinical-summary"
    >
      <Stack spacing={1.5}>
        {entries.map(([key, value]) => (
          <Box key={key}>
            <Typography
              variant="body2"
              color="text.secondary"
              display="block"
              sx={{ lineHeight: 1.55 }}
            >
              {patientSummaryFieldLabel(key)}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </EpisWorkspaceSection>
  );
}
