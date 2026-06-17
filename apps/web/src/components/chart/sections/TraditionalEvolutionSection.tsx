import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { Stack } from '@epis2/epis2-ui';
import { ClinicalFilterableTimeline } from '../timeline/ClinicalFilterableTimeline.js';

export type TraditionalEvolutionSectionProps = {
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  onOpenEvolution?: (() => void) | undefined;
  onOpenDraft?: ((draftId: string) => void) | undefined;
  /** CICA-L-03 — timeline limpio; acción primaria solo en layoutActions. */
  compositionMode?: 'default' | 'cica-classic' | undefined;
  testId?: string | undefined;
};

/** MF-DI-08 — evoluciones + timeline filtrable agrupado. */
export function TraditionalEvolutionSection({
  longitudinal,
  onOpenDraft,
  compositionMode = 'default',
  testId = 'epis2-traditional-section-evolution',
}: TraditionalEvolutionSectionProps) {
  const cicaClassic = compositionMode === 'cica-classic';
  const timeline = longitudinal?.timeline ?? [];

  return (
    <Stack
      spacing={1.5}
      data-testid={testId}
      {...(cicaClassic ? { 'data-cica-composition': 'classic' } : {})}
    >
      <ClinicalFilterableTimeline
        timeline={timeline}
        onOpenDraft={onOpenDraft}
        compositionMode={compositionMode}
      />
    </Stack>
  );
}
