import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export type ErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ title, message, onRetry, retryLabel = 'Reintentar' }: ErrorStateProps) {
  return (
    <Alert severity="error" sx={{ maxWidth: 480, mx: 'auto' }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
      {onRetry ? (
        <Stack direction="row" sx={{ mt: 2 }}>
          <Button variant="outlined" color="inherit" size="small" onClick={onRetry}>
            {retryLabel}
          </Button>
        </Stack>
      ) : null}
    </Alert>
  );
}
