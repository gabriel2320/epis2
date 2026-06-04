import { copy } from '@epis2/design-system';
import { AutoAwesomeIcon, SearchIcon } from '../mui/index.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisTextField } from '../primitives/EpisTextField.js';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type EpisCommandBarProps = {
  label: string;
  placeholder: string;
  submitLabel: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
  aiAvailable?: boolean | null;
  aiHint?: string;
  roleLabel?: string;
  disabled?: boolean;
};

/** Barra de comando dominante — Centro de Comando EPIS2. */
export function EpisCommandBar({
  label,
  placeholder,
  submitLabel,
  value,
  onChange,
  onSubmit,
  error,
  aiAvailable = null,
  aiHint,
  roleLabel,
  disabled = false,
}: EpisCommandBarProps) {
  return (
    <Box
      component="form"
      data-testid="epis2-power-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      sx={{ width: '100%' }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
        {roleLabel ? (
          <EpisChip
            size="small"
            label={roleLabel}
            variant="outlined"
            data-testid="epis2-command-role-chip"
          />
        ) : null}
        {aiAvailable !== null ? (
          <EpisChip
            size="small"
            icon={<AutoAwesomeIcon />}
            label={aiAvailable ? copy.commandCenter.aiStatusOn : copy.commandCenter.aiStatusOff}
            color={aiAvailable ? 'success' : 'default'}
            variant={aiAvailable ? 'filled' : 'outlined'}
            data-testid="epis2-command-ai-status"
          />
        ) : null}
      </Stack>
      <EpisTextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={Boolean(error)}
        helperText={error ?? aiHint}
        disabled={disabled}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment:
              aiAvailable === true ? (
                <InputAdornment position="end">
                  <AutoAwesomeIcon color="success" fontSize="small" aria-hidden />
                </InputAdornment>
              ) : undefined,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            minHeight: 56,
            fontSize: '1.05rem',
          },
        }}
      />
      {aiHint && !error ? (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {aiHint}
        </Typography>
      ) : null}
      <EpisButton
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={disabled}
        sx={{ mt: 2, minHeight: 48 }}
      >
        {submitLabel}
      </EpisButton>
    </Box>
  );
}
