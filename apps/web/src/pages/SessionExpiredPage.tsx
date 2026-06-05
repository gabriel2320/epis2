import { copy } from '@epis2/design-system';
import { useNavigate } from '@tanstack/react-router';
import { ErrorState } from '../components/ErrorState.js';
import { Box, epis2ShellContentIslandSx } from '@epis2/epis2-ui';

export function SessionExpiredPage() {
  const navigate = useNavigate();

  return (
    <Box sx={epis2ShellContentIslandSx} data-testid="epis2-session-expired">
      <ErrorState
        title={copy.errors.sessionExpiredTitle}
        message={copy.errors.sessionExpiredMessage}
        onRetry={() => void navigate({ to: '/login' })}
        retryLabel={copy.errors.sessionExpiredAction}
      />
    </Box>
  );
}
