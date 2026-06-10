import { copy } from '@epis2/design-system';
import {
  AssignmentIcon,
  Box,
  Drawer,
  EpisButton,
  EpisIconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  LocalHospitalIcon,
  MedicationIcon,
  MenuIcon,
  ScienceIcon,
  Stack,
  SummarizeIcon,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { ClassicLeftNavItem } from './EpisClassicMd3LeftNavigation.js';

const ICONS: Record<string, ReactNode> = {
  summary: <SummarizeIcon fontSize="small" />,
  history: <AssignmentIcon fontSize="small" />,
  evolution: <LocalHospitalIcon fontSize="small" />,
  orders: <AssignmentIcon fontSize="small" />,
  medications: <MedicationIcon fontSize="small" />,
  labs: <ScienceIcon fontSize="small" />,
};

export type EpisClassicMd3MobileNavProps = {
  items: readonly ClassicLeftNavItem[];
  activeId?: string | undefined;
  onSelect: (id: string) => void;
  testId?: string;
};

/** Navegación móvil clásica — drawer + accesos rápidos visibles (< md). */
export function EpisClassicMd3MobileNav({
  items,
  activeId,
  onSelect,
  testId = 'epis2-classic-md3-mobile-nav',
}: EpisClassicMd3MobileNavProps) {
  const [open, setOpen] = useState(false);
  const primary = items.filter((i) => i.group !== 'more').slice(0, 4);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      data-testid={testId}
      sx={{
        display: { xs: 'flex', md: 'none' },
        px: 1,
        py: 0.5,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflowX: 'auto',
      }}
    >
      <EpisIconButton
        aria-label={copy.classicMd3.mobileNavOpen}
        data-testid={`${testId}-trigger`}
        onClick={() => setOpen(true)}
        size="small"
        sx={{ width: 40, height: 40, flexShrink: 0 }}
      >
        <MenuIcon fontSize="small" />
      </EpisIconButton>
      {primary.map((item) => (
        <EpisButton
          key={item.id}
          appearance={activeId === item.id ? 'filled' : 'text'}
          size="small"
          onClick={() => onSelect(item.id)}
          data-testid={`${testId}-${item.id}`}
          startIcon={ICONS[item.id] ?? ICONS.summary}
          sx={{ flexShrink: 0, minWidth: 0, px: 1 }}
        >
          {item.label.split(' ')[0]}
        </EpisButton>
      ))}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        data-testid={`${testId}-drawer`}
        slotProps={{
          paper: { sx: { width: 280, borderTopRightRadius: 16, borderBottomRightRadius: 16 } },
        }}
      >
        <Box component="nav" aria-label={copy.classicMd3.mobileNavOpen} sx={{ pt: 1 }}>
          <List>
            {items.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={activeId === item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  data-testid={`${testId}-drawer-${item.id}`}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Stack>
  );
}
