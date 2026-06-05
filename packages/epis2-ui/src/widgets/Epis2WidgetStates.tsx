import { EpisAlert } from '../primitives/EpisAlert.js';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export type Epis2WidgetStateMessageProps = {
  message: string;
};

export function Epis2WidgetLoading({ message }: Epis2WidgetStateMessageProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      data-testid="epis2-widget-loading"
      sx={{ py: 2, px: 0.5 }}
    >
      <CircularProgress size={22} aria-hidden />
      <EpisM3Text role="bodyMedium" color="text.secondary">
        {message}
      </EpisM3Text>
    </Stack>
  );
}

export function Epis2WidgetEmpty({ message }: Epis2WidgetStateMessageProps) {
  return (
    <EpisAlert severity="info" variant="outlined" data-testid="epis2-widget-empty">
      {message}
    </EpisAlert>
  );
}

export function Epis2WidgetError({ message }: Epis2WidgetStateMessageProps) {
  return (
    <EpisAlert severity="error" variant="outlined" data-testid="epis2-widget-error">
      {message}
    </EpisAlert>
  );
}

export function Epis2WidgetForbidden({ message }: Epis2WidgetStateMessageProps) {
  return (
    <EpisAlert severity="warning" variant="outlined" data-testid="epis2-widget-forbidden">
      {message}
    </EpisAlert>
  );
}

export function Epis2WidgetOffline({ message }: Epis2WidgetStateMessageProps) {
  return (
    <EpisAlert severity="info" variant="outlined" data-testid="epis2-widget-offline">
      {message}
    </EpisAlert>
  );
}

export function Epis2WidgetAiDisclosure({ message }: Epis2WidgetStateMessageProps) {
  return (
    <EpisAlert severity="info" variant="outlined" data-testid="epis2-widget-ai-disclosure">
      {message}
    </EpisAlert>
  );
}
