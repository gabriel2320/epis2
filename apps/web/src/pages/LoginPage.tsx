import { copy, type DemoRole } from '@epis2/design-system';
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
import { useDemoSession } from '../session/DemoSessionContext.js';

const ROLES = Object.keys(copy.roles) as DemoRole[];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useDemoSession();
  const [role, setRole] = useState<DemoRole>('physician');

  const handleSubmit = () => {
    login(role);
    void navigate({ to: '/comando' });
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
      <Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: 1, borderColor: 'divider' }}>
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
            label={copy.login.roleLabel}
            value={role}
            onChange={(e) => setRole(e.target.value as DemoRole)}
            fullWidth
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {copy.roles[r]}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" size="large" onClick={handleSubmit}>
            {copy.login.submit}
          </Button>

          <Alert severity="info" variant="outlined">
            {copy.login.hint}
          </Alert>
        </Stack>
      </Paper>
    </Box>
  );
}
