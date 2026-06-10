import { copy } from '@epis2/design-system';
import { EPIS_COMMAND_BAR_MAX_SUGGESTIONS } from '../../quality/uiDensityRules.js';
import {
  EpisCommandCenterHero,
  EpisCommandCenterInlineBar,
  EpisChip,
  EpisCommandResult,
  EpisM3Text,
  Stack,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { CommandCenterClassicAccess } from './CommandCenterClassicAccess.js';
import { CommandCenterDashboardAccess } from './CommandCenterDashboardAccess.js';
import { CommandCenterRecentPatientsCompact } from './CommandCenterRecentPatientsCompact.js';

export type EpisCommandCenterGoogleBarProps = {
  role: string;
  permissions: readonly string[];
  aiAvailable: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onSelectSuggestion: (command: string) => void;
  isResolving: boolean;
  error?: string | undefined;
  aiHint?: string | undefined;
  contextSlot?: ReactNode | undefined;
  clarificationCandidates?: readonly { intent: string; labelEs: string }[] | undefined;
  onClarificationSelect?: ((label: string) => void) | undefined;
  footerSlot?: ReactNode | undefined;
};

/**
 * Barra central tipo Google/ChatGPT — home `/comando`.
 * Reutiliza command-registry vía callbacks; no embebe ficha ni dashboard.
 */
export function EpisCommandCenterGoogleBar({
  role,
  permissions,
  aiAvailable,
  query,
  onQueryChange,
  onSubmit,
  onSelectSuggestion,
  isResolving,
  error,
  aiHint,
  contextSlot,
  clarificationCandidates,
  onClarificationSelect,
  footerSlot,
}: EpisCommandCenterGoogleBarProps) {
  const visibleCandidates = (clarificationCandidates ?? []).slice(
    0,
    EPIS_COMMAND_BAR_MAX_SUGGESTIONS,
  );

  return (
    <Stack spacing={2.5} sx={{ width: '100%' }} data-testid="epis2-command-google-bar">
      <EpisM3Text
        role="labelMedium"
        color="text.secondary"
        sx={{ textAlign: 'center', letterSpacing: 0.4 }}
        data-testid="epis2-command-google-brand"
      >
        {copy.commandCenter.googleBarBrand}
      </EpisM3Text>

      <EpisCommandCenterHero
        role={role}
        permissions={permissions}
        aiAvailable={aiAvailable}
        onSelect={onSelectSuggestion}
        contextSlot={contextSlot}
        powerBarSlot={
          <EpisCommandCenterInlineBar
            label={copy.commandCenter.powerBarLabel}
            placeholder={copy.commandCenter.powerBarPlaceholder}
            submitLabel={isResolving ? copy.commandCenter.resolving : copy.commandCenter.submit}
            value={query}
            onChange={onQueryChange}
            onSubmit={onSubmit}
            {...(error ? { error } : {})}
            {...(error ? {} : aiHint ? { aiHint } : {})}
            disabled={isResolving}
          />
        }
      />

      <CommandCenterClassicAccess />
      <CommandCenterDashboardAccess />
      <CommandCenterRecentPatientsCompact />

      {visibleCandidates.length > 0 && onClarificationSelect ? (
        <EpisCommandResult title={copy.commandCenter.clarificationTitle}>
          <Stack direction="row" flexWrap="wrap" gap={1} data-testid="epis2-command-clarification">
            {visibleCandidates.map((c) => (
              <EpisChip
                key={c.intent}
                label={c.labelEs}
                size="small"
                variant="outlined"
                clickable
                onClick={() => onClarificationSelect(c.labelEs)}
              />
            ))}
          </Stack>
        </EpisCommandResult>
      ) : null}

      {footerSlot}
    </Stack>
  );
}
