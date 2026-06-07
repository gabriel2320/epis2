import { getCommandCenterWireSuggestions } from '@epis2/command-registry';
import { copy } from '@epis2/design-system';
import { AutoAwesomeIcon, LockOutlinedIcon } from '../mui/index.js';
import Stack from '@mui/material/Stack';
import { useMemo, type ReactNode } from 'react';
import { EpisAssistChip } from '../primitives/EpisM3Chips.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { EpisCommandSuggestionCards } from './EpisCommandSuggestionCards.js';
import { getIntentChipIcon } from './intent-icons.js';
import { getIntentChipTone } from './intent-visual.js';

export type EpisCommandCenterHeroProps = {
  role: string;
  permissions: readonly string[];
  aiAvailable?: boolean;
  onSelect: (command: string) => void;
  /** Línea de contexto paciente (apps/web). */
  contextSlot?: ReactNode;
};

/** Hero command-first — título Mockup A + chips/cards del registry; dock queda abajo. */
export function EpisCommandCenterHero({
  role,
  permissions,
  aiAvailable = false,
  onSelect,
  contextSlot,
}: EpisCommandCenterHeroProps) {
  const { quickChips, cardChips } = useMemo(
    () => getCommandCenterWireSuggestions(role, permissions, { aiAvailable }),
    [role, permissions, aiAvailable],
  );

  return (
    <Stack
      spacing={{ xs: 2.5, md: 3 }}
      alignItems="center"
      sx={{ width: '100%', textAlign: 'center' }}
      data-testid="epis2-command-hero"
    >
      <Stack spacing={0.75} alignItems="center" sx={{ width: '100%' }}>
        <EpisM3Text
          role="displayMedium"
          component="h1"
          data-testid="epis2-command-prompt"
          sx={{ maxWidth: '28ch' }}
        >
          {copy.commandCenter.title}
        </EpisM3Text>
        <EpisM3Text role="labelMedium" color="text.secondary">
          {copy.commandCenter.flowSubtitle}
        </EpisM3Text>
        <EpisM3Text role="bodyMedium" color="text.secondary" sx={{ maxWidth: '42ch' }}>
          {copy.commandCenter.subtitle}
        </EpisM3Text>
      </Stack>

      {contextSlot ? (
        <Stack sx={{ width: '100%' }} data-testid="epis2-command-hero-context">
          {contextSlot}
        </Stack>
      ) : null}

      {quickChips.length > 0 ? (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
          justifyContent="center"
          sx={{ width: '100%' }}
          data-testid="epis2-command-quick-chips"
        >
          {quickChips.map((chip) => (
            <EpisAssistChip
              key={chip.id}
              icon={getIntentChipIcon(chip.intent)}
              label={chip.sampleEs}
              title={chip.labelEs}
              tone={getIntentChipTone(chip.intent)}
              clickable
              sx={{ maxWidth: '100%' }}
              onClick={() => onSelect(chip.sampleEs)}
            />
          ))}
        </Stack>
      ) : null}

      <EpisCommandSuggestionCards cards={cardChips} onSelect={onSelect} />

      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        justifyContent="center"
        sx={{ width: '100%', px: 1 }}
        data-testid="epis2-command-safety-note"
      >
        <LockOutlinedIcon fontSize="small" color="action" aria-hidden />
        <EpisM3Text role="labelMedium" color="text.secondary">
          {copy.commandCenter.safetyReviewNote}
        </EpisM3Text>
      </Stack>

      {aiAvailable ? (
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
          <AutoAwesomeIcon fontSize="small" color="success" aria-hidden />
          <EpisM3Text role="labelMedium" color="success.main">
            {copy.commandCenter.suggestionsAiTitle}
          </EpisM3Text>
        </Stack>
      ) : null}
    </Stack>
  );
}
