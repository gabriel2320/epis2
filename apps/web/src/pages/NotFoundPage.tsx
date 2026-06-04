import { copy } from '@epis2/design-system';
import Box from '@mui/material/Box';
import { useNavigate } from '@tanstack/react-router';
import { ErrorState } from '../components/ErrorState.js';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 6 }}>
      <ErrorState
        title={copy.errors.notFoundTitle}
        message={copy.errors.notFoundMessage}
        onRetry={() => void navigate({ to: '/comando' })}
        retryLabel={copy.layout.backToCommand}
      />
    </Box>
  );
}
