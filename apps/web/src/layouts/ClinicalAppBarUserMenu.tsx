import { copy } from '@epis2/design-system';
import {
  Drawer,
  EpisButton,
  EpisThemeModeToggle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';

/** Menú Usuario — preferencias y cierre de sesión fuera de la barra principal (UX-A.3). */
export function ClinicalAppBarUserMenu() {
  const { session, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const displayName = session?.user.displayName ?? copy.layout.navUser;

  return (
    <>
      <EpisButton
        appearance="text"
        size="small"
        data-testid="epis2-nav-usuario"
        onClick={() => setOpen(true)}
      >
        {copy.layout.navUser}
      </EpisButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        data-testid="epis2-nav-usuario-drawer"
      >
        <Stack spacing={2} sx={{ width: 280, p: 2 }}>
          <Typography variant="subtitle1">{displayName}</Typography>
          {session?.user.role ? (
            <Typography variant="body2" color="text.secondary">
              {copy.roles[session.user.role as keyof typeof copy.roles] ?? session.user.role}
            </Typography>
          ) : null}
          <List dense disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/preferencias-apariencia"
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={copy.themePreferences.openLink} />
              </ListItemButton>
            </ListItem>
          </List>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {copy.themePreferences.mode}
            </Typography>
            <EpisThemeModeToggle data-testid="epis2-nav-usuario-theme" />
          </Stack>
          <EpisButton
            appearance="outlined"
            size="small"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            {copy.layout.logout}
          </EpisButton>
        </Stack>
      </Drawer>
    </>
  );
}
