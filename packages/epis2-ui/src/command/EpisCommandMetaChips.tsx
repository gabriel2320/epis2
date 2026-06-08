import { copy } from '@epis2/design-system';
import { AutoAwesomeIcon } from '../mui/index.js';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { EpisChip } from '../primitives/EpisChip.js';
import { roleChipToneSx } from '../theme/chip-tones.js';
import { getRoleChipTone } from './intent-visual.js';
import { getRoleChipIcon } from './role-icons.js';

export type EpisCommandMetaChipsProps = {
  role: string;
  roleLabel: string;
  aiAvailable?: boolean | null;
};

/** Chips de rol e IA bajo la barra del Centro de Comando. */
export function EpisCommandMetaChips({ role, roleLabel, aiAvailable = null }: EpisCommandMetaChipsProps) {
  const theme = useTheme();
  const clinical = theme.epis2?.clinical;

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="center" sx={{ gap: 0.75 }}>
      <EpisChip
        size="small"
        label={roleLabel}
        variant="outlined"
        data-testid="epis2-command-role-chip"
        icon={getRoleChipIcon(role)}
        sx={roleChipToneSx(getRoleChipTone(role), theme)}
      />
      {aiAvailable !== null ? (
        <EpisChip
          size="small"
          icon={<AutoAwesomeIcon fontSize="small" />}
          label={aiAvailable ? copy.commandCenter.aiStatusOn : copy.commandCenter.aiStatusOff}
          variant="outlined"
          data-testid="epis2-command-ai-status"
          sx={
            aiAvailable
              ? {
                  bgcolor: clinical?.approved.container,
                  color: clinical?.approved.onContainer,
                  borderColor: clinical?.approved.main,
                  fontWeight: 600,
                }
              : {
                  bgcolor: clinical?.warning.container,
                  color: clinical?.warning.onContainer,
                  borderColor: clinical?.warning.main,
                  fontWeight: 600,
                }
          }
        />
      ) : null}
    </Stack>
  );
}
