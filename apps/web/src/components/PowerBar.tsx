import {
  AutoAwesomeIcon,
  Box,
  EpisButton,
  EpisChip,
  EpisTextField,
  InputAdornment,
  SearchIcon,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
export type PowerBarProps = {
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
};

/** Barra de comando dominante — entrada principal del Centro de Comando. */
export function PowerBar({
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
}: PowerBarProps) {
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
          <EpisChip size="small" label={roleLabel} variant="outlined" data-testid="epis2-command-role-chip" />
        ) : null}
        {aiAvailable !== null ? (
          <EpisChip
            size="small"
            icon={<AutoAwesomeIcon />}
            label={aiAvailable ? 'IA local' : 'Sin IA'}
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
        sx={{ mt: 2, minHeight: 48 }}
      >
        {submitLabel}
      </EpisButton>
    </Box>
  );
}
