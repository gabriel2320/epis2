import { copy } from '@epis2/design-system';
import {
  AssignmentIcon,
  Box,
  List,
  ListItemButton,
  ListItemText,
  LocalHospitalIcon,
  MedicationIcon,
  ScienceIcon,
  SummarizeIcon,
  Typography,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type ClassicLeftNavItem = {
  id: string;
  label: string;
  group?: 'primary' | 'more';
};

export type EpisClassicMd3LeftNavigationProps = {
  items: readonly ClassicLeftNavItem[];
  activeId?: string;
  compact?: boolean;
  onSelect: (id: string) => void;
  testId?: string;
};

const ICONS: Record<string, ReactNode> = {
  summary: <SummarizeIcon fontSize="small" />,
  history: <AssignmentIcon fontSize="small" />,
  evolution: <LocalHospitalIcon fontSize="small" />,
  orders: <AssignmentIcon fontSize="small" />,
  medications: <MedicationIcon fontSize="small" />,
  labs: <ScienceIcon fontSize="small" />,
};

/** Navegación lateral fija — solo cambia vista/foco. */
export function EpisClassicMd3LeftNavigation({
  items,
  activeId,
  compact = false,
  onSelect,
  testId = 'epis2-classic-md3-left-nav',
}: EpisClassicMd3LeftNavigationProps) {
  const primary = items.filter((i) => i.group !== 'more');
  const more = items.filter((i) => i.group === 'more');

  return (
    <List
      dense
      component="nav"
      data-testid={testId}
      sx={{
        width: compact ? 72 : 240,
        flexShrink: 0,
        py: 1,
        borderRight: 1,
        borderColor: 'divider',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {primary.map((item) => (
        <ListItemButton
          key={item.id}
          selected={activeId === item.id}
          onClick={() => onSelect(item.id)}
          data-testid={`${testId}-${item.id}`}
          sx={{ minHeight: 44 }}
        >
          <Box component="span" sx={{ minWidth: compact ? 40 : 36, display: 'inline-flex' }}>
            {ICONS[item.id] ?? ICONS.summary}
          </Box>
          {!compact ? <ListItemText primary={item.label} /> : null}
        </ListItemButton>
      ))}
      {!compact && more.length > 0 ? (
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, pt: 1 }}>
          {copy.classicMd3.navMore}
        </Typography>
      ) : null}
      {more.map((item) => (
        <ListItemButton
          key={item.id}
          selected={activeId === item.id}
          onClick={() => onSelect(item.id)}
          data-testid={`${testId}-${item.id}`}
        >
          {!compact ? <ListItemText primary={item.label} /> : null}
        </ListItemButton>
      ))}
    </List>
  );
}
