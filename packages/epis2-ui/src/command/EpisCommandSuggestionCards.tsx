import type { CommandChip } from '@epis2/command-registry';
import { copy } from '@epis2/design-system';
import { ChevronRightIcon } from '../mui/index.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme, type Theme } from '@mui/material/styles';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { intentIconSurfaceSx } from '../theme/chip-tones.js';
import { epis2Shape } from '../theme/shape.js';
import { getIntentChipIcon } from './intent-icons.js';
import { getIntentChipTone, getIntentSuggestionBadge } from './intent-visual.js';

export type EpisCommandSuggestionCardsProps = {
  cards: readonly CommandChip[];
  onSelect: (command: string) => void;
};

function badgeSx(tone: 'default' | 'success' | 'info' | 'warning', theme: Theme) {
  const clinical = theme.epis2?.clinical;
  const map = {
    default: {
      bgcolor: theme.palette.action.hover,
      color: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
    },
    success: {
      bgcolor: clinical?.approved.container,
      color: clinical?.approved.onContainer,
      borderColor: clinical?.approved.main,
    },
    info: {
      bgcolor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
      borderColor: theme.palette.primary.main,
    },
    warning: {
      bgcolor: clinical?.warning.container,
      color: clinical?.warning.onContainer,
      borderColor: clinical?.warning.main,
    },
  };
  return map[tone];
}

/** Fila de tarjetas sugeridas — registry (Mockup A, sin Paper anidado). */
export function EpisCommandSuggestionCards({ cards, onSelect }: EpisCommandSuggestionCardsProps) {
  const theme = useTheme();

  if (cards.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }} data-testid="epis2-command-suggestion-cards">
      <EpisM3Text role="titleMedium" component="h2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
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
        {cards.map((card) => {
          const tone = getIntentChipTone(card.intent, card.aiAssisted);
          const badge = getIntentSuggestionBadge(card.intent);
          const badgeLabel = copy.commandCenter[badge.labelKey];

          return (
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
                gap: 1.25,
                minHeight: 132,
                transition: 'background-color 120ms ease, border-color 120ms ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'primary.main',
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
                      width: 40,
                      height: 40,
                      borderRadius: `${epis2Shape.medium}px`,
                      flexShrink: 0,
                      ...intentIconSurfaceSx(tone, theme),
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
                label={badgeLabel}
                variant="outlined"
                sx={{ alignSelf: 'flex-start', maxWidth: '100%', fontWeight: 600, ...badgeSx(badge.tone, theme) }}
                tabIndex={-1}
              />
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
