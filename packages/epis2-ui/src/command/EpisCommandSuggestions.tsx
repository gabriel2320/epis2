import { getCommandChipsForRole } from '@epis2/command-registry';
import { copy } from '@epis2/design-system';
import { AutoAwesomeIcon, TipsAndUpdatesIcon } from '../mui/index.js';
import { EpisAssistChip } from '../primitives/EpisM3Chips.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { epis2Shape } from '../theme/shape.js';
import { getIntentChipIcon } from './intent-icons.js';
import { getIntentChipTone } from './intent-visual.js';

export type EpisCommandSuggestionsProps = {
  role: string;
  permissions: readonly string[];
  aiAvailable?: boolean;
  onSelect: (command: string) => void;
};

export function EpisCommandSuggestions({
  role,
  permissions,
  aiAvailable = false,
  onSelect,
}: EpisCommandSuggestionsProps) {
  const theme = useTheme();
  const chips = getCommandChipsForRole(role, permissions, { aiAvailable });
  const aiChips = chips.filter((c) => c.aiAssisted);
  const roleChips = chips.filter((c) => !c.aiAssisted);

  return (
    <Stack spacing={3} sx={{ width: '100%', px: { xs: 0.5, sm: 1 } }} data-testid="epis2-command-chips">
      {aiChips.length > 0 ? (
        <Stack spacing={1} alignItems="center">
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <AutoAwesomeIcon fontSize="small" color="success" />
            <EpisM3Text role="labelLarge" color="success.main">
              {copy.commandCenter.suggestionsAiTitle}
            </EpisM3Text>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent="center">
            {aiChips.map((chip) => (
              <EpisAssistChip
                key={chip.id}
                icon={getIntentChipIcon(chip.intent, true)}
                label={chip.labelEs}
                title={chip.sampleEs}
                tone="ai"
                clickable
                sx={{ maxWidth: '100%' }}
                onClick={() => onSelect(chip.sampleEs)}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}
      <Stack spacing={1} alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <TipsAndUpdatesIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
          <EpisM3Text role="labelLarge" color="primary.main">
            {copy.commandCenter.suggestionsRoleTitle}
          </EpisM3Text>
        </Stack>
        <Box
          sx={{
            p: 2,
            borderRadius: `${epis2Shape.island}px`,
            border: 'none',
            borderColor: theme.epis2?.visual?.cardBorder ?? 'divider',
            bgcolor: theme.epis2?.visual?.powerBarBg ?? 'background.paper',
            width: '100%',
          }}
        >
          <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent="center">
            {roleChips.map((chip) => {
              const tone = getIntentChipTone(chip.intent);
              return (
                <EpisAssistChip
                  key={chip.id}
                  icon={getIntentChipIcon(chip.intent)}
                  label={chip.sampleEs}
                  title={chip.labelEs}
                  tone={tone}
                  clickable
                  sx={{ maxWidth: '100%' }}
                  onClick={() => onSelect(chip.sampleEs)}
                />
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}
