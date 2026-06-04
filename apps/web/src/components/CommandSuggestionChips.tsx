import { getCommandChipsForRole } from '@epis2/command-registry';
import { copy } from '@epis2/design-system';

import {
  AutoAwesomeIcon,
  Chip,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
export type CommandSuggestionChipsProps = {
  role: string;
  permissions: readonly string[];
  aiAvailable?: boolean;
  onSelect: (command: string) => void;
};

export function CommandSuggestionChips({
  role,
  permissions,
  aiAvailable = false,
  onSelect,
}: CommandSuggestionChipsProps) {
  const chips = getCommandChipsForRole(role, permissions, { aiAvailable });
  const aiChips = chips.filter((c) => c.aiAssisted);
  const roleChips = chips.filter((c) => !c.aiAssisted);

  return (
    <Stack spacing={1.5} sx={{ width: '100%' }} data-testid="epis2-command-chips">
      {aiChips.length > 0 ? (
        <Stack spacing={0.5} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {copy.commandCenter.suggestionsAiTitle}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
            {aiChips.map((chip) => (
              <Chip
                key={chip.id}
                icon={<AutoAwesomeIcon />}
                label={chip.sampleEs}
                variant="outlined"
                color="success"
                clickable
                onClick={() => onSelect(chip.sampleEs)}
                sx={{ borderRadius: 999 }}
              />
            ))}
          </Stack>
        </Stack>
      ) : null}
      <Stack spacing={0.5} alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {copy.commandCenter.suggestionsRoleTitle}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
          {roleChips.map((chip) => (
            <Chip
              key={chip.id}
              label={chip.sampleEs}
              title={chip.labelEs}
              variant="outlined"
              clickable
              onClick={() => onSelect(chip.sampleEs)}
              sx={{ borderRadius: 999 }}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
