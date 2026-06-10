import { copy } from '@epis2/design-system';
import { AutoAwesomeIcon, PsychologyIcon, SearchIcon } from '../mui/index.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisTextField } from '../primitives/EpisTextField.js';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { epis2BarLayout } from '../theme/breakpoints.js';
import { roleChipToneSx } from '../theme/chip-tones.js';
import { epis2PillBarSx } from '../theme/island-layout.js';
import { epis2Shape } from '../theme/shape.js';
import { getRoleChipTone } from './intent-visual.js';
import { getRoleChipIcon } from './role-icons.js';

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
  role?: string;
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
  role,
  disabled = false,
}: EpisCommandBarProps) {
  const theme = useTheme();
  const visual = theme.epis2?.visual;
  const clinical = theme.epis2?.clinical;

  return (
    <Box
      component="form"
      data-testid="epis2-power-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      sx={{
        width: '100%',
        px: { xs: 0.5, sm: 1 },
        py: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        sx={{ mb: epis2BarLayout.chipsToFieldGap, gap: 2 }}
      >
        {roleLabel ? (
          <EpisChip
            size="small"
            label={roleLabel}
            variant="outlined"
            data-testid="epis2-command-role-chip"
            {...(role ? { icon: getRoleChipIcon(role) } : {})}
            {...(role ? { sx: roleChipToneSx(getRoleChipTone(role), theme) } : {})}
          />
        ) : null}
        {aiAvailable !== null ? (
          <EpisChip
            size="small"
            icon={<AutoAwesomeIcon />}
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
              <InputAdornment position="start" sx={{ ml: 0.5 }}>
                <PsychologyIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment:
              aiAvailable === true ? (
                <InputAdornment position="end" sx={{ mr: 0.5 }}>
                  <AutoAwesomeIcon
                    sx={{ color: clinical?.approved.main }}
                    fontSize="small"
                    aria-hidden
                  />
                </InputAdornment>
              ) : aiAvailable === false ? (
                <InputAdornment position="end" sx={{ mr: 0.5 }}>
                  <SearchIcon color="action" fontSize="small" aria-hidden />
                </InputAdornment>
              ) : undefined,
          },
        }}
        sx={{
          ...epis2PillBarSx,
          '& .MuiOutlinedInput-root': {
            minHeight: epis2BarLayout.inputMinHeight,
            fontSize: '0.875rem',
            borderRadius: epis2Shape.pill,
            bgcolor: visual?.powerBarBg ?? 'action.hover',
            px: 0.5,
            boxShadow: 'none',
            '&.Mui-focused': {
              boxShadow: visual?.powerBarFocusShadow ?? 'none',
            },
          },
          '& .MuiOutlinedInput-input': {
            px: 2.5,
            py: 2,
          },
          '& .MuiInputLabel-root': {
            px: 1.5,
          },
          '& .MuiFormHelperText-root': {
            mx: 0,
            px: 1.5,
            mt: 1.25,
            color: aiAvailable === true ? clinical?.approved.main : undefined,
          },
        }}
      />
      <EpisButton
        type="submit"
        appearance="filled"
        size="large"
        fullWidth
        disabled={disabled}
        startIcon={<SearchIcon />}
        sx={{
          mt: 4,
          minHeight: 48,
          borderRadius: epis2Shape.squircle,
          py: 1.75,
          px: 3.5,
        }}
      >
        {submitLabel}
      </EpisButton>
    </Box>
  );
}
