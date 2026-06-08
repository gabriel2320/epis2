import { SearchIcon } from '../mui/index.js';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import { EpisTextField } from '../primitives/EpisTextField.js';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { epis2BarLayout } from '../theme/breakpoints.js';
import { epis2Shape } from '../theme/shape.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';

export type EpisCommandCenterInlineBarProps = {
  label: string;
  placeholder: string;
  submitLabel: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
  aiHint?: string;
  disabled?: boolean;
};

/** Barra de comando centrada — pantalla de decisión (sin iconos decorativos). */
export function EpisCommandCenterInlineBar({
  label,
  placeholder,
  submitLabel,
  value,
  onChange,
  onSubmit,
  error,
  aiHint,
  disabled = false,
}: EpisCommandCenterInlineBarProps) {
  const theme = useTheme();
  const visual = theme.epis2?.visual;
  const helperText = error ?? aiHint;

  return (
    <Box
      component="form"
      data-testid="epis2-power-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      sx={{ width: '100%', maxWidth: epis2BarLayout.maxWidth.medium, mx: 'auto' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          width: '100%',
          minHeight: epis2BarLayout.inputMinHeight,
          px: { xs: 1, sm: 1.5 },
          py: 0.5,
          borderRadius: epis2Shape.pill,
          border: 2,
          borderColor: visual?.powerBarBorder ?? 'primary.main',
          bgcolor: 'background.paper',
          boxShadow: 'none',
          transition: 'border-color 120ms ease, box-shadow 120ms ease',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: visual?.powerBarFocusShadow ?? 'none',
          },
        }}
      >
        <EpisTextField
          fullWidth
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={Boolean(error)}
          disabled={disabled}
          slotProps={{
            input: {
              'aria-label': label,
              sx: { py: 1.25, px: 0.5, fontSize: '1rem' },
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0.25 }}>
                  <EpisIconButton
                    type="submit"
                    aria-label={submitLabel}
                    disabled={disabled}
                    size="medium"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </EpisIconButton>
                </InputAdornment>
              ),
            },
            inputLabel: {
              sx: {
                position: 'absolute',
                width: 1,
                height: 1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              minHeight: 'unset',
              bgcolor: 'transparent',
              boxShadow: 'none',
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
            },
            '& .MuiInputLabel-root': { display: 'none' },
          }}
        />
      </Box>

      {helperText ? (
        <EpisM3Text
          role="labelMedium"
          component="p"
          color={error ? 'error.main' : 'text.secondary'}
          sx={{ mt: 1, px: 1, textAlign: 'center' }}
        >
          {helperText}
        </EpisM3Text>
      ) : null}
    </Box>
  );
}
