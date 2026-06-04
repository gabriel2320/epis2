import { AlertTitle, EpisAlert, EpisButton, Stack } from '@epis2/epis2-ui';

export type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ title, message, onRetry, retryLabel = 'Reintentar' }: ErrorStateProps) {
  return (
    <EpisAlert severity="error" sx={{ maxWidth: 480, mx: 'auto' }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
      {onRetry ? (
        <Stack direction="row" sx={{ mt: 2 }}>
          <EpisButton variant="outlined" color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </EpisButton>
        </Stack>
      ) : null}
    </EpisAlert>
  );
}
