import { copy } from '@epis2/design-system';
import { AutoAwesomeIcon, PsychologyIcon, SearchIcon } from '../mui/index.js';
import { EpisButton } from '../primitives/EpisButton.js';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import { EpisTextField } from '../primitives/EpisTextField.js';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { epis2BarLayout, epis2Breakpoints } from '../theme/breakpoints.js';
import { roleChipToneSx } from '../theme/chip-tones.js';
import { epis2Shape } from '../theme/shape.js';
import { getRoleChipTone } from './intent-visual.js';
import { getRoleChipIcon } from './role-icons.js';

export type EpisFloatingCommandDockProps = {
  /** Pregunta principal — accesibilidad y test id canónico. */
  prompt: string;
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
  /** Oculta el titular visible — contexto ya en chrome del paciente (ficha). */
  compact?: boolean;
};

/** Dock flotante inferior — Power Bar command-first (Vista 1 Command Center). */
export function EpisFloatingCommandDock({
  prompt,
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
  compact = false,
}: EpisFloatingCommandDockProps) {
  const theme = useTheme();
  const visual = theme.epis2?.visual;
  const clinical = theme.epis2?.clinical;
  const isMedium = useMediaQuery(`(min-width:${epis2Breakpoints.medium}px)`);
  const maxWidth = isMedium ? epis2BarLayout.maxWidth.medium : epis2BarLayout.maxWidth.compact;

  const helperText = error ?? (error ? undefined : aiHint);

  return (
    <Box
      component="section"
      aria-label={prompt}
      data-testid="epis2-floating-command-dock"
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (t) => t.zIndex.snackbar,
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 2.5 },
        pt: 1,
        pointerEvents: 'none',
      }}
    >
      <Box
        component="form"
        data-testid="epis2-power-bar"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        sx={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth,
          bgcolor: 'background.paper',
          borderRadius: `${epis2Shape.floating}px`,
          boxShadow: visual?.floatingDockShadow ?? 'none',
          border: 1,
          borderColor: visual?.powerBarBorder ?? 'divider',
          px: { xs: compact ? 1.5 : 2, sm: compact ? 2 : 2.5 },
          py: { xs: compact ? 1.25 : 1.5, sm: compact ? 1.5 : 2 },
        }}
      >
        {compact ? (
          <Box
            component="h2"
            sx={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}
          >
            {prompt}
          </Box>
        ) : (
          <EpisM3Text
            role="titleMedium"
            component="h1"
            data-testid="epis2-command-prompt"
            sx={{ mb: 1.5, textAlign: { xs: 'center', sm: 'left' } }}
          >
            {prompt}
          </EpisM3Text>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          sx={{ mb: 1, gap: 0.75 }}
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

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ sm: 'flex-start' }}
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
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 0.25 }}>
                    <PsychologyIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment:
                  aiAvailable === true ? (
                    <InputAdornment position="end" sx={{ mr: 0.25 }}>
                      <AutoAwesomeIcon
                        sx={{ color: clinical?.approved.main }}
                        fontSize="small"
                        aria-hidden
                      />
                    </InputAdornment>
                  ) : undefined,
              },
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                minHeight: 48,
                borderRadius: epis2Shape.pill,
                bgcolor: visual?.powerBarBg ?? 'action.hover',
              },
            }}
          />
          <EpisButton
            type="submit"
            appearance="filled"
            size="large"
            disabled={disabled}
            startIcon={<SearchIcon />}
            sx={{
              minHeight: 48,
              minWidth: { xs: '100%', sm: 140 },
              borderRadius: epis2Shape.squircle,
              flexShrink: 0,
            }}
          >
            {submitLabel}
          </EpisButton>
        </Stack>

        {helperText ? (
          <EpisM3Text
            role="labelMedium"
            component="p"
            color={error ? 'error.main' : 'text.secondary'}
            sx={{
              mt: 1,
              px: 0.5,
              ...(aiAvailable === true && !error ? { color: clinical?.approved.main } : {}),
            }}
          >
            {helperText}
          </EpisM3Text>
        ) : null}
      </Box>
    </Box>
  );
}
