import { SYNTHETIC_USERS } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 4, maxWidth: 440, width: '100%', border: 1, borderColor: 'divider' }}>
        <Stack spacing={3} data-testid="epis2-login-page">
          <Stack spacing={1} alignItems="center">
            <Typography variant="h4" color="primary" fontWeight={700}>
              {copy.appName}
            </Typography>
            <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
            <Typography variant="h6">{copy.login.title}</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {copy.login.subtitle}
            </Typography>
          </Stack>

          <TextField
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
          </TextField>

          <TextField
            label={copy.login.demoKeyLabel}
            value={demoAuthKey}
            onChange={(e) => setDemoAuthKey(e.target.value)}
            placeholder={copy.login.demoKeyPlaceholder}
            fullWidth
            type="password"
            autoComplete="off"
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button variant="contained" size="large" onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? copy.login.submitting : copy.login.submit}
          </Button>

          <Alert severity="info" variant="outlined">
            {copy.login.hint}
          </Alert>
        </Stack>
      </Paper>
    </Box>
  );
}
