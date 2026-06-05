import { copy } from '@epis2/design-system';
import { useNavigate } from '@tanstack/react-router';
import { ErrorState } from '../components/ErrorState.js';
import { Box, epis2ShellContentIslandSx } from '@epis2/epis2-ui';

export type ForbiddenPageProps = {
  detail?: string;
};

export function ForbiddenPage({ detail }: ForbiddenPageProps) {
  const navigate = useNavigate();
  const message = detail?.trim() ? detail : copy.errors.forbiddenMessage;

  return (
    <Box sx={epis2ShellContentIslandSx} data-testid="epis2-forbidden">
      <ErrorState
        title={copy.errors.forbiddenTitle}
        message={message}
        onRetry={() => void navigate({ to: '/comando' })}
        retryLabel={copy.errors.forbiddenAction}
      />
    </Box>
  );
}
