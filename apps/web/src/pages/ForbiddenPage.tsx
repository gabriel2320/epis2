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

export type ForbiddenPageProps = {
  detail?: string | undefined;
};

export function ForbiddenPage({ detail }: ForbiddenPageProps) {
  const navigate = useNavigate();
  const message = detail?.trim() ? detail : copy.errors.forbiddenMessage;

  return (
    <EpisAuthScreen testId="epis2-forbidden">
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <EpisBrandMark size={48} />
        <EpisM3Text role="titleLarge" component="h1">
          {copy.errors.forbiddenTitle}
        </EpisM3Text>
        <EpisAlert severity="error" sx={{ width: '100%' }}>
          {message}
        </EpisAlert>
        <EpisButton
          appearance="filled"
          fullWidth
          onClick={() => void navigate({ to: '/comando' })}
          data-testid="epis2-forbidden-action"
        >
          {copy.errors.forbiddenAction}
        </EpisButton>
      </Stack>
    </EpisAuthScreen>
  );
}
