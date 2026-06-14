import { SYNTHETIC_USERS } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import {
  Box,
  EpisAlert,
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
    <EpisAuthScreen>
      <Stack spacing={1.25} alignItems="center" textAlign="center" data-testid="epis2-login-header">
        <EpisBrandMark size={56} />
        <EpisM3Text role="displayMedium" color="primary.main" component="h1">
          {copy.appName}
        </EpisM3Text>
        <EpisM3Text role="titleMedium" color="text.secondary">
          {copy.login.tagline}
        </EpisM3Text>
        <EpisDemoBadgeChip icon={<ScienceIcon fontSize="small" />} label={copy.demoBadge} />
      </Stack>

      <Box
        component="form"
        data-testid="epis2-login-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        <Stack spacing={2.5}>
          <EpisTextField
            select
            label={copy.login.usernameLabel}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
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

          <EpisM3Text
            role="labelMedium"
            color="text.secondary"
            textAlign="center"
            component="p"
            sx={{ px: 0.5, lineHeight: 1.5 }}
          >
            {copy.login.subtitle}. {copy.login.hint}
          </EpisM3Text>
        </Stack>
      </Box>
    </EpisAuthScreen>
  );
}
