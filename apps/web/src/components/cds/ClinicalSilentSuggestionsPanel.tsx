import type { SilentClinicalSuggestion } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { EpisButton, Stack, Typography } from '@epis2/epis2-ui';
import { useState } from 'react';
import { ClinicalCdsCard } from './ClinicalCdsCard.js';

export type ClinicalSilentSuggestionsPanelProps = {
  suggestions: readonly SilentClinicalSuggestion[];
  onSelectCommand?: ((commandSample: string) => void) | undefined;
  maxVisible?: number | undefined;
  testId?: string | undefined;
};

/** MF-DI-06 — panel de sugerencias silenciosas (máx. N visibles, resto colapsable). */
export function ClinicalSilentSuggestionsPanel({
  suggestions,
  onSelectCommand,
  maxVisible = 3,
  testId = 'epis2-clinical-silent-suggestions',
}: ClinicalSilentSuggestionsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (suggestions.length === 0) return null;

  const hiddenCount = Math.max(0, suggestions.length - maxVisible);
  const visible = expanded ? suggestions : suggestions.slice(0, maxVisible);

  return (
    <Stack spacing={1} data-testid={testId} sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary" component="h3">
        {copy.clinicalSummary.silentSuggestionsTitle}
      </Typography>
      <Stack spacing={0.75}>
        {visible.map((item) => (
          <ClinicalCdsCard
            key={item.id}
            variant={item.variant}
            label={item.labelEs}
            detail={item.detailEs}
            onAction={
              item.commandSample && onSelectCommand
                ? () => onSelectCommand(item.commandSample!)
                : undefined
            }
            testId={`${testId}-chip-${item.id}`}
          />
        ))}
      </Stack>
      {hiddenCount > 0 ? (
        <EpisButton
          appearance="text"
          size="small"
          onClick={() => setExpanded((open) => !open)}
          data-testid={`${testId}-toggle`}
        >
          {expanded
            ? copy.clinicalSummary.silentSuggestionsShowLess
            : copy.clinicalSummary.silentSuggestionsShowMore.replace(
                '{count}',
                String(hiddenCount),
              )}
        </EpisButton>
      ) : null}
    </Stack>
  );
}
