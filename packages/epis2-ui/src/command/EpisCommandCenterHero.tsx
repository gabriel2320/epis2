import { getCommandCenterWireSuggestions } from '@epis2/command-registry';
import { copy } from '@epis2/design-system';
import Stack from '@mui/material/Stack';
import { useMemo, type ReactNode } from 'react';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { EpisCommandSuggestionCards } from './EpisCommandSuggestionCards.js';

export type EpisCommandCenterHeroProps = {
  role: string;
  permissions: readonly string[];
  aiAvailable?: boolean;
  onSelect: (command: string) => void;
  /** Barra de comando centrada. */
  powerBarSlot?: ReactNode;
  /** Línea de contexto paciente — solo si hay paciente activo. */
  contextSlot?: ReactNode;
  /** Tarjetas grandes (desactivado en MF-UI-DENSITY por defecto). */
  richCards?: boolean;
};

/** Hero command-first — pantalla de decisión (MF-UI-DENSITY). */
export function EpisCommandCenterHero({
  role,
  permissions,
  aiAvailable = false,
  onSelect,
  powerBarSlot,
  contextSlot,
  richCards = false,
}: EpisCommandCenterHeroProps) {
  const { quickChips, cardChips } = useMemo(
    () =>
      getCommandCenterWireSuggestions(role, permissions, {
        aiAvailable,
        richCards,
      }),
    [role, permissions, aiAvailable, richCards],
  );

  return (
    <Stack
      spacing={{ xs: 2, md: 2.5 }}
      alignItems="stretch"
      sx={{ width: '100%' }}
      data-testid="epis2-command-hero"
    >
      <Stack spacing={0.5} alignItems="center" sx={{ width: '100%', textAlign: 'center' }}>
        <EpisM3Text
          role="displayMedium"
          component="h1"
          data-testid="epis2-command-prompt"
          sx={{ maxWidth: '22ch' }}
        >
          {copy.commandCenter.title}
        </EpisM3Text>
      </Stack>

      {powerBarSlot ? (
        <Stack sx={{ width: '100%' }} data-testid="epis2-command-hero-power-bar">
          {powerBarSlot}
        </Stack>
      ) : null}

      {quickChips.length > 0 ? (
        <Stack spacing={0.75} sx={{ width: '100%' }} data-testid="epis2-command-suggestions-block">
          <EpisM3Text role="titleMedium" component="h2" sx={{ textAlign: 'center' }}>
            {copy.commandCenter.suggestionsForYou}
          </EpisM3Text>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            justifyContent="center"
            sx={{ width: '100%' }}
            data-testid="epis2-command-quick-chips"
          >
            {quickChips.map((chip) => (
              <EpisChip
                key={chip.id}
                label={chip.sampleEs}
                title={chip.labelEs}
                size="medium"
                variant="outlined"
                clickable
                sx={{ maxWidth: '100%' }}
                onClick={() => onSelect(chip.sampleEs)}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}

      {cardChips.length > 0 ? (
        <EpisCommandSuggestionCards cards={cardChips} onSelect={onSelect} />
      ) : null}

      {contextSlot ? (
        <Stack sx={{ width: '100%' }} data-testid="epis2-command-hero-context">
          {contextSlot}
        </Stack>
      ) : null}
    </Stack>
  );
}
