import type { ClinicalContextDensePayload } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { Box, Chip, Stack, Typography } from '@epis2/epis2-ui';

export type ClinicalContextDenseStripProps = {
  dense: ClinicalContextDensePayload | null;
  testId?: string;
};

function DenseField({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <Stack spacing={0} sx={{ minWidth: 0, flex: '1 1 140px', maxWidth: 360 }} data-testid={testId}>
      <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.35 }}>
        {value}
      </Typography>
    </Stack>
  );
}

/** MF-DI-01 — franja contextual persistente bajo identidad paciente. */
export function ClinicalContextDenseStrip({
  dense,
  testId = 'epis2-clinical-context-dense-strip',
}: ClinicalContextDenseStripProps) {
  if (!dense) return null;

  const hasProblems = dense.activeProblems.length > 0;
  const hasMeds = Boolean(dense.medicationSummary);
  const hasLabs = dense.labHighlights.length > 0;
  const hasEncounter = Boolean(dense.lastEncounterRelativeEs);
  const hasCare = Boolean(dense.careSettingLabel);

  if (!hasProblems && !hasMeds && !hasLabs && !hasEncounter && !hasCare && !dense.episodeOpen) {
    return null;
  }

  return (
    <Box
      data-testid={testId}
      sx={{
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
        flexShrink: 0,
      }}
    >
      <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5} alignItems="flex-start">
        {dense.episodeOpen ? (
          <Chip
            size="small"
            color="info"
            variant="outlined"
            label={copy.contextDense.episodeOpen}
            data-testid={`${testId}-episode-open`}
          />
        ) : null}
        {dense.careSettingLabel ? (
          <Chip
            size="small"
            variant="outlined"
            label={dense.careSettingLabel}
            data-testid={`${testId}-care-setting`}
          />
        ) : null}
        {hasProblems ? (
          <DenseField
            label={copy.contextDense.activeProblems}
            value={dense.activeProblems.join(' · ')}
            testId={`${testId}-problems`}
          />
        ) : null}
        {hasMeds ? (
          <DenseField
            label={copy.contextDense.activeMedications}
            value={dense.medicationSummary!}
            testId={`${testId}-medications`}
          />
        ) : null}
        {hasEncounter ? (
          <DenseField
            label={copy.contextDense.lastEncounter}
            value={dense.lastEncounterRelativeEs!}
            testId={`${testId}-last-encounter`}
          />
        ) : null}
        {hasLabs
          ? dense.labHighlights.map((lab) => (
              <DenseField
                key={`${lab.label}-${lab.observedAt}`}
                label={lab.label}
                value={`${lab.value} · ${lab.relativeAgeEs}`}
                testId={`${testId}-lab-${lab.label.replace(/\s+/g, '-').toLowerCase()}`}
              />
            ))
          : null}
      </Stack>
    </Box>
  );
}
