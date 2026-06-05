import { SYNTHETIC_USERS } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  EpisAlert,
  EpisAuthScreen,
  EpisButton,
  EpisChip,
  EpisM3Text,
  EpisTextField,
  MenuItem,
  Stack,
} from '@epis2/epis2-ui';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('medico.demo');
  const [demoAuthKey, setDemoAuthKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(username, demoAuthKey);
      void navigate({ to: '/comando' });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EpisAuthScreen>
      <Stack spacing={1} alignItems="center" textAlign="center">
        <EpisM3Text role="displayMedium" color="primary.main" component="p">
          {copy.appName}
        </EpisM3Text>
        <EpisM3Text role="titleMedium" color="text.secondary">
          {copy.login.tagline}
        </EpisM3Text>
        <EpisChip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
      </Stack>

      <EpisTextField
        select
        label={copy.login.usernameLabel}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      >
        {SYNTHETIC_USERS.map((u) => (
          <MenuItem key={u.id} value={u.username}>
            {u.displayName} ({copy.roles[u.role]})
          </MenuItem>
        ))}
      </EpisTextField>

      <EpisTextField
        label={copy.login.demoKeyLabel}
        value={demoAuthKey}
        onChange={(e) => setDemoAuthKey(e.target.value)}
        placeholder={copy.login.demoKeyPlaceholder}
        fullWidth
        type="password"
        autoComplete="off"
      />

      {error ? <EpisAlert severity="error">{error}</EpisAlert> : null}

      <EpisButton appearance="filled" size="large" onClick={() => void handleSubmit()} disabled={loading}>
        {loading ? copy.login.submitting : copy.login.submit}
      </EpisButton>

      <EpisM3Text role="labelMedium" color="text.secondary" textAlign="center" component="p">
        {copy.login.hint}
      </EpisM3Text>
    </EpisAuthScreen>
  );
}
