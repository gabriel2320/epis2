import Alert from '@mui/material/Alert';
import Snackbar, { type SnackbarProps } from '@mui/material/Snackbar';

export type EpisSnackbarProps = SnackbarProps & {
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
};

/** Feedback temporal M3 — snackbar con alerta semántica. */
export function EpisSnackbar({
  message,
  severity = 'info',
  autoHideDuration = 4000,
  ...rest
}: EpisSnackbarProps) {
  return (
    <Snackbar autoHideDuration={autoHideDuration} {...rest}>
      <Alert severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
