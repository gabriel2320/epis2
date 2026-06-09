import {
  AssignmentIcon,
  EpisIconButton,
  MedicationIcon,
  ScienceIcon,
  SearchIcon,
  Stack,
  SummarizeIcon,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type ClassicActionRailItem = {
  id: string;
  label: string;
};

export type EpisClassicMd3ActionRailProps = {
  items: readonly ClassicActionRailItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  compact?: boolean;
  testId?: string;
};

const RAIL_ICONS: Record<string, ReactNode> = {
  'rail-history': <AssignmentIcon fontSize="small" />,
  'rail-labs': <ScienceIcon fontSize="small" />,
  'rail-imaging': <SearchIcon fontSize="small" />,
  'rail-meds': <MedicationIcon fontSize="small" />,
  'rail-documents': <SummarizeIcon fontSize="small" />,
  settings: <SearchIcon fontSize="small" />,
};

/** Action rail derecho — navegación rápida, sin acciones irreversibles. */
export function EpisClassicMd3ActionRail({
  items,
  activeId,
  onSelect,
  compact = false,
  testId = 'epis2-classic-md3-action-rail',
}: EpisClassicMd3ActionRailProps) {
  return (
    <Stack
      data-testid={testId}
      spacing={0.5}
      alignItems="center"
      sx={{
        width: compact ? 56 : 64,
        flexShrink: 0,
        py: 1,
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: { xs: 'none', sm: 'flex' },
      }}
    >
      {items.slice(0, 10).map((item) => (
        <EpisIconButton
          key={item.id}
          size="small"
          color={activeId === item.id ? 'primary' : 'default'}
          onClick={() => onSelect(item.id)}
          data-testid={`${testId}-${item.id}`}
          aria-label={item.label}
          title={item.label}
        >
          {RAIL_ICONS[item.id] ?? RAIL_ICONS.settings}
        </EpisIconButton>
      ))}
    </Stack>
  );
}
