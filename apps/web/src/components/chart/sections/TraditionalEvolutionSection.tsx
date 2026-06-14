import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { ClinicalFilterableTimeline } from '../timeline/ClinicalFilterableTimeline.js';

export type TraditionalEvolutionSectionProps = {
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  onOpenEvolution?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  testId?: string | undefined;
};

/** MF-DI-08 — evoluciones + timeline filtrable agrupado. */
export function TraditionalEvolutionSection({
  longitudinal,
  onOpenEvolution,
  onOpenDraft,
  testId = 'epis2-traditional-section-evolution',
}: TraditionalEvolutionSectionProps) {
  const timeline = longitudinal?.timeline ?? [];

  return (
    <Stack spacing={1.5} data-testid={testId}>
      <ClinicalFilterableTimeline timeline={timeline} onOpenDraft={onOpenDraft} />
      {onOpenEvolution ? (
        <EpisButton appearance="text" size="small" onClick={onOpenEvolution} sx={{ alignSelf: 'flex-start' }}>
          {copy.chartModes.actionEvolution}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
