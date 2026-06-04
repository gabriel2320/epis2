import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type EpisEmptyStateProps = {
  title: string;
  description?: string;
};

export function EpisEmptyState({ title, description }: EpisEmptyStateProps) {
  return (
    <Stack alignItems="center" spacing={0.5} py={4} data-testid="epis-empty">
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Stack>
  );
}
