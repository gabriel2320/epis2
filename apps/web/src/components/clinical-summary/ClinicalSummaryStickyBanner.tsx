import type { ClinicalAlert, PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { Box, Chip, Stack } from '@epis2/epis2-ui';
import { formatAllergyLine } from './clinicalSummaryData.js';

export type ClinicalSummaryStickyBannerProps = {
  alerts?: readonly ClinicalAlert[] | undefined;
  allergies?: PatientLongitudinalResponse['allergies'] | undefined;
  previsionResumen?: string | null | undefined;
  hospitalizado?: boolean | undefined;
  testId?: string;
};

/** Banner sticky 2 líneas + chips — UX-CALM-PATIENT (MF-CLINICAL-SUMMARY-B). */
export function ClinicalSummaryStickyBanner({
  alerts = [],
  allergies = [],
  previsionResumen,
  hospitalizado = false,
  testId = 'epis2-clinical-summary-sticky-banner',
}: ClinicalSummaryStickyBannerProps) {
  const critical = alerts.filter((a) => a.severity === 'critical');
  const allergyChips = allergies.slice(0, 4);
  const prevision = previsionResumen?.trim();

  if (critical.length === 0 && allergyChips.length === 0 && !prevision && !hospitalizado) {
    return null;
  }

  return (
    <Box
      data-testid={testId}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        py: 1,
        px: 1.5,
        mb: 1,
        borderRadius: `${20}px`,
        border: 1,
        borderColor: 'outlineVariant',
        bgcolor: 'surfaceContainerHigh',
      }}
    >
      <Stack direction="row" flexWrap="wrap" gap={0.75} alignItems="center">
        {prevision ? (
          <Chip
            size="small"
            variant="outlined"
            label={`${copy.clinicalSummary.coveragePrevision}: ${prevision}`}
            data-testid={`${testId}-prevision`}
          />
        ) : null}
        {hospitalizado ? (
          <Chip
            size="small"
            variant="filled"
            label={copy.clinicalSummary.hospitalizedBadge}
            data-testid={`${testId}-hospitalized`}
            sx={{ bgcolor: 'info.light', color: 'info.dark' }}
          />
        ) : null}
        {critical.map((a) => (
          <Chip
            key={a.ruleId}
            size="small"
            variant="filled"
            label={a.message}
            sx={{ bgcolor: 'error.light', color: 'error.dark' }}
          />
        ))}
        {allergyChips.map((a) => (
          <Chip
            key={a.id}
            size="small"
            variant="filled"
            label={formatAllergyLine(a)}
            sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}
          />
        ))}
        {critical.length === 0 && allergyChips.length > 0 ? (
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            {copy.clinicalSummary.manageAllergies}
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
