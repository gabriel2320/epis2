import type { CommandChip } from '@epis2/command-registry';
import { EpisCommandSuggestionCards, Box } from '@epis2/epis2-ui';

export type ClinicalProbableActionsPanelProps = {
  chips: readonly CommandChip[];
  onSelect: (commandSample: string) => void;
  testId?: string;
};

/** MF-DI-05 — acciones probables en resumen de ficha (sin escribir en barra). */
export function ClinicalProbableActionsPanel({
  chips,
  onSelect,
  testId = 'epis2-clinical-probable-actions',
}: ClinicalProbableActionsPanelProps) {
  if (chips.length === 0) return null;

  return (
    <Box data-testid={testId} sx={{ mb: 2 }}>
      <EpisCommandSuggestionCards cards={chips} onSelect={onSelect} />
    </Box>
  );
}
