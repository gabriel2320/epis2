import { copy } from '@epis2/design-system';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { CommandSuggestionChips } from '../components/CommandSuggestionChips.js';
import { PowerBar } from '../components/PowerBar.js';
import { useAuth } from '../auth/AuthContext.js';

export function CommandCenterPage() {
  const { session, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError(copy.commandCenter.emptyCommand);
      return;
    }
    setError(undefined);
    setLastCommand(trimmed);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
        py: 3,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ maxWidth: 720, mx: 'auto', mb: 4 }}>
        <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
        <Button size="small" color="inherit" onClick={logout}>
          Cerrar sesión
        </Button>
      </Stack>

      <Stack
        spacing={4}
        alignItems="center"
        data-testid="epis2-command-center"
        sx={{ maxWidth: 720, mx: 'auto' }}
      >
        <Stack spacing={1} alignItems="center">
          <Typography variant="h4" component="h1" color="primary" fontWeight={700}>
            {copy.appName}
          </Typography>
          {session ? (
            <Typography variant="body2" color="text.secondary">
              {session.user.displayName}
            </Typography>
          ) : null}
        </Stack>

        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h5" component="h2" data-testid="epis2-command-prompt">
            {copy.commandCenter.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {copy.commandCenter.subtitle}
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <PowerBar
            label={copy.commandCenter.powerBarLabel}
            placeholder={copy.commandCenter.powerBarPlaceholder}
            submitLabel={copy.commandCenter.submit}
            value={query}
            onChange={setQuery}
            onSubmit={submit}
            error={error}
          />
        </Box>

        <CommandSuggestionChips
          onSelect={(cmd) => {
            setQuery(cmd);
            setError(undefined);
          }}
        />

        {lastCommand ? (
          <Paper variant="outlined" sx={{ p: 2, width: '100%' }}>
            <Typography variant="subtitle2" gutterBottom>
              {copy.commandCenter.previewTitle}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {lastCommand}
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              {copy.commandCenter.previewPending}
            </Alert>
          </Paper>
        ) : null}
      </Stack>
    </Box>
  );
}
