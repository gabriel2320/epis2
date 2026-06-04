import { copy } from '@epis2/design-system';
import { Link, Outlet } from '@tanstack/react-router';
import { useAuth } from '../auth/AuthContext.js';
import { ActivePatientBanner } from '../components/ActivePatientBanner.js';

import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Toolbar,
  Typography,
} from '@epis2/epis2-ui';
export function ClinicalShellLayout() {
  const { session, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component={Link} to="/comando" color="primary" sx={{ textDecoration: 'none', fontWeight: 700 }}>
            {copy.appName}
          </Typography>
          <Chip label={copy.demoBadge} size="small" color="warning" variant="outlined" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ActivePatientBanner />
          </Box>
          {session ? (
            <Typography variant="body2" color="text.secondary">
              {session.user.displayName}
            </Typography>
          ) : null}
          <Button component={Link} to="/comando" size="small">
            {copy.layout.backToCommand}
          </Button>
          <Button size="small" color="inherit" onClick={logout}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
