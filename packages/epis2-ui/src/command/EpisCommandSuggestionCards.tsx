import type { CommandChip } from '@epis2/command-registry';
import { copy } from '@epis2/design-system';
import { ChevronRightIcon } from '../mui/index.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { epis2Shape } from '../theme/shape.js';
import { getIntentChipIcon } from './intent-icons.js';

export type EpisCommandSuggestionCardsProps = {
  cards: readonly CommandChip[];
  onSelect: (command: string) => void;
};

/** Fila de tarjetas sugeridas — registry (Mockup A, sin Paper anidado). */
export function EpisCommandSuggestionCards({ cards, onSelect }: EpisCommandSuggestionCardsProps) {
  const theme = useTheme();

  if (cards.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }} data-testid="epis2-command-suggestion-cards">
      <EpisM3Text role="titleMedium" component="h2">
        {copy.commandCenter.suggestionsForYou}
      </EpisM3Text>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
          width: '100%',
        }}
      >
        {cards.map((card) => (
          <Box
            key={card.id}
            component="button"
            type="button"
            data-testid={`epis2-suggestion-card-${card.intent}`}
            onClick={() => onSelect(card.sampleEs)}
            sx={{
              m: 0,
              p: 2,
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
              border: 1,
              borderColor: theme.epis2?.visual?.cardBorder ?? 'divider',
              borderRadius: `${epis2Shape.floating}px`,
              bgcolor: 'background.paper',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              minHeight: 120,
              transition: 'background-color 120ms ease',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              '&:focus-visible': {
                outline: `2px solid ${theme.epis2?.visual?.focusRing ?? theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: `${epis2Shape.medium}px`,
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {getIntentChipIcon(card.intent)}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <EpisM3Text role="titleMedium" component="span" sx={{ display: 'block' }}>
                    {card.labelEs}
                  </EpisM3Text>
                  <EpisM3Text role="bodyMedium" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    {card.sampleEs}
                  </EpisM3Text>
                </Box>
              </Stack>
              <ChevronRightIcon fontSize="small" color="action" aria-hidden />
            </Stack>
            <EpisChip
              size="small"
              label={copy.commandCenter.suggestionRegistryTag}
              variant="outlined"
              sx={{ alignSelf: 'flex-start', maxWidth: '100%' }}
              tabIndex={-1}
            />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
