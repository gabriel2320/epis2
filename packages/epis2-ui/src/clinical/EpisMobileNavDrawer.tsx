import { useState, type ReactNode } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { EpisIconButton } from '../primitives/EpisIconButton.js';
import type { EpisNavigationRailItem } from './EpisNavigationRail.js';

export type EpisMobileNavDrawerProps = {
  items: EpisNavigationRailItem[];
  footer?: ReactNode;
  testId?: string;
};

/**
 * MF-NORM-403 — navegación móvil MD3: bajo el breakpoint medium el rail colapsa
 * a un Drawer modal disparado desde un botón de menú. Reusa los mismos items
 * (y data-testid) del rail para que los flujos E2E funcionen en ambos modos.
 */
export function EpisMobileNavDrawer({
  items,
  footer,
  testId = 'epis2-mobile-nav',
}: EpisMobileNavDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EpisIconButton
        aria-label="Abrir navegación"
        data-testid={`${testId}-trigger`}
        onClick={() => setOpen(true)}
        sx={{ width: 48, height: 48 }}
      >
        <MenuIcon />
      </EpisIconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            // MD3 modal navigation drawer: esquinas redondeadas al lado del contenido.
            sx: { width: 280, borderTopRightRadius: 16, borderBottomRightRadius: 16 },
          },
        }}
        data-testid={`${testId}-drawer`}
      >
        <Box
          component="nav"
          aria-label="Navegación principal"
          sx={{ display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}
        >
          <List sx={{ flex: 1 }}>
            {items.map((item) => {
              if (item.variant === 'divider') {
                return <Divider key={item.id} sx={{ my: 1 }} />;
              }
              return (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    selected={Boolean(item.active)}
                    disabled={Boolean(item.disabled)}
                    {...(item.active ? { 'aria-current': 'page' as const } : {})}
                    data-testid={item['data-testid'] ?? `epis2-mobile-nav-${item.id}`}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    sx={{ borderRadius: 7, mx: 1 }}
                  >
                    {item.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          {footer ? <Box sx={{ p: 1.5 }}>{footer}</Box> : null}
        </Box>
      </Drawer>
    </>
  );
}
