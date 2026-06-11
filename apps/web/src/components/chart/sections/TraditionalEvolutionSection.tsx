import type { PatientLongitudinalResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import { EpisButton, Stack } from '@epis2/epis2-ui';
import { getDemoChartSectionRows } from '@epis2/test-fixtures';
import { TraditionalSectionDataTable } from './TraditionalSectionDataTable.js';

export type TraditionalEvolutionSectionProps = {
  demoCaseCode?: string | undefined;
  longitudinal?: PatientLongitudinalResponse | null | undefined;
  onOpenEvolution?: (() => void) | undefined;
  testId?: string | undefined;
};

export function TraditionalEvolutionSection({
  demoCaseCode,
  longitudinal,
  onOpenEvolution,
  testId = 'epis2-traditional-section-evolution',
}: TraditionalEvolutionSectionProps) {
  const timeline = longitudinal?.timeline ?? [];
  const fromLongitudinal = timeline.slice(0, 8).map((e) => ({
    label: new Date(e.at).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }),
    value: e.detail ? `${e.title}\n${e.detail}` : e.title,
  }));
  const rows =
    fromLongitudinal.length > 0
      ? fromLongitudinal
      : getDemoChartSectionRows(demoCaseCode, 'navEvolution');

  return (
    <Stack spacing={1.5} data-testid={testId}>
      <TraditionalSectionDataTable rows={rows} testId={`${testId}-table`} />
      {onOpenEvolution ? (
        <EpisButton appearance="text" size="small" onClick={onOpenEvolution} sx={{ alignSelf: 'flex-start' }}>
          {copy.chartModes.actionEvolution}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
