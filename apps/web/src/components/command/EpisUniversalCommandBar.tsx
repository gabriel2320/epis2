import { copy } from '@epis2/design-system';
import { EPIS_COMMAND_BAR_MAX_SUGGESTIONS } from '../../quality/uiDensityRules.js';
import { EpisButton, EpisChip, EpisTextField, Stack } from '@epis2/epis2-ui';

export type EpisUniversalCommandBarVariant =
  | 'command-center'
  | 'classic-contextual'
  | 'dashboard-operational';

const PLACEHOLDER: Record<EpisUniversalCommandBarVariant, string> = {
  'command-center': copy.commandCenter.title,
  'classic-contextual': copy.classicMd3.commandPlaceholder,
  'dashboard-operational': copy.dashboardMd3.commandPlaceholder,
};

const SUBMIT_LABEL: Record<EpisUniversalCommandBarVariant, string> = {
  'command-center': copy.commandCenter.submit,
  'classic-contextual': copy.classicMd3.commandSubmit,
  'dashboard-operational': copy.dashboardMd3.commandSubmit,
};

export type EpisUniversalCommandBarProps = {
  variant: EpisUniversalCommandBarVariant;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  suggestions?: readonly string[] | undefined;
  onSuggestionSelect?: ((label: string) => void) | undefined;
  disabled?: boolean | undefined;
  testId?: string | undefined;
};

/** Command bar unificada — variantes por modo, command-registry vía callbacks de página. */
export function EpisUniversalCommandBar({
  variant,
  query,
  onQueryChange,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
  disabled = false,
  testId = 'epis2-universal-command-bar',
}: EpisUniversalCommandBarProps) {
  const visibleSuggestions = suggestions.slice(0, EPIS_COMMAND_BAR_MAX_SUGGESTIONS);

  return (
    <Stack
      data-testid={testId}
      data-epis-command-variant={variant}
      spacing={1}
      sx={{
        flexShrink: 0,
        px: { xs: 1.5, md: 2 },
        py: 1,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
        <EpisTextField
          label={PLACEHOLDER[variant]}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
          }}
          fullWidth
          size="small"
          disabled={disabled}
          data-testid={`${testId}-input`}
        />
        <EpisButton appearance="filled" size="small" onClick={onSubmit} disabled={disabled}>
          {SUBMIT_LABEL[variant]}
        </EpisButton>
      </Stack>
      {visibleSuggestions.length > 0 ? (
        <Stack direction="row" flexWrap="wrap" gap={0.75} data-testid={`${testId}-suggestions`}>
          {visibleSuggestions.map((label) => (
            <EpisChip
              key={label}
              size="small"
              variant="outlined"
              label={label}
              clickable
              onClick={() => onSuggestionSelect?.(label)}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
