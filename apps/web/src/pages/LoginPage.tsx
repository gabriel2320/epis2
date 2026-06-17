import { SYNTHETIC_USERS } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  EpisAlert,
  EpisAuthBrandTitle,
  EpisAuthScreen,
  EpisBrandMark,
  EpisButton,
  EpisDemoBadgeChip,
  EpisM3Text,
  EpisTextField,
  InputAdornment,
  KeyIcon,
  LoginIcon,
  MenuItem,
  PersonIcon,
  ScienceIcon,
  Stack,
} from '@epis2/epis2-ui';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ApiError } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.js';
import { EPIS2_CLINICAL_HOME } from '../routes/home.js';

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
      void navigate({ to: EPIS2_CLINICAL_HOME });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : copy.errors.genericMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EpisAuthScreen
      brand={
        <EpisAuthBrandTitle title={copy.appName} subtitle={copy.login.tagline} />
      }
      footer={
        <EpisM3Text role="labelMedium" color="text.secondary" component="p">
          {copy.demoBadge} · {copy.login.subtitle}
        </EpisM3Text>
      }
    >
      <Stack spacing={1.25} alignItems="center" textAlign="center" data-testid="epis2-login-header">
        <EpisBrandMark size={48} />
        <EpisM3Text role="headlineMedium" color="primary.main" component="h1">
          {copy.login.submit}
        </EpisM3Text>
        <EpisDemoBadgeChip icon={<ScienceIcon fontSize="small" />} label={copy.demoBadge} />
      </Stack>

      <Stack
        component="form"
        spacing={2}
        data-testid="epis2-login-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
          <EpisTextField
            select
            label={copy.login.usernameLabel}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
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
            size="medium"
            type="password"
            autoComplete="off"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon color="secondary" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {error ? <EpisAlert severity="error">{error}</EpisAlert> : null}

          <EpisButton
            type="submit"
            appearance="filled"
            size="large"
            fullWidth
            startIcon={<LoginIcon />}
            disabled={loading}
            data-testid="epis2-login-submit"
          >
            {loading ? copy.login.submitting : copy.login.submit}
          </EpisButton>

          <EpisM3Text role="labelMedium" color="text.secondary" textAlign="center" component="p">
            {copy.login.hint}
          </EpisM3Text>
      </Stack>
    </EpisAuthScreen>
  );
}
