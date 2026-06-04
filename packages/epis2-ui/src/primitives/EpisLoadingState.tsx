import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type EpisLoadingStateProps = {
  label?: string;
};

export function EpisLoadingState({ label = 'Cargando…' }: EpisLoadingStateProps) {
  return (
    <Stack alignItems="center" spacing={1} py={4} data-testid="epis-loading">
      <CircularProgress size={32} aria-label={label} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}
