import { copy } from '@epis2/design-system';
import {
  EpisAlert,
  EpisAuthScreen,
  EpisBrandMark,
  EpisButton,
  EpisM3Text,
  Stack,
} from '@epis2/epis2-ui';
import { useNavigate } from '@tanstack/react-router';

export function SessionExpiredPage() {
  const navigate = useNavigate();

  return (
    <EpisAuthScreen testId="epis2-session-expired">
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <EpisBrandMark size={48} />
        <EpisM3Text role="titleLarge" component="h1">
          {copy.errors.sessionExpiredTitle}
        </EpisM3Text>
        <EpisAlert severity="warning" sx={{ width: '100%' }}>
          {copy.errors.sessionExpiredMessage}
        </EpisAlert>
        <EpisButton
          appearance="filled"
          fullWidth
          onClick={() => void navigate({ to: '/login' })}
          data-testid="epis2-session-expired-action"
        >
          {copy.errors.sessionExpiredAction}
        </EpisButton>
      </Stack>
    </EpisAuthScreen>
  );
}
