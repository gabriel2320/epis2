import { copy } from '@epis2/design-system';
import { useNavigate } from '@tanstack/react-router';
import { ErrorState } from '../components/ErrorState.js';

import { Box, epis2ShellContentIslandSx } from '@epis2/epis2-ui';
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={epis2ShellContentIslandSx}>
      <ErrorState
        title={copy.errors.notFoundTitle}
        message={copy.errors.notFoundMessage}
        onRetry={() => void navigate({ to: '/comando' })}
        retryLabel={copy.layout.backToCommand}
      />
    </Box>
  );
}
