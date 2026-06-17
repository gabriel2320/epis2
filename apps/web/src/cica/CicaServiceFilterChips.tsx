import { Chip, Stack } from '@epis2/epis2-ui';

export type CicaServiceFilter = 'todos' | 'uti' | 'uci' | 'mq';

const FILTERS: { id: CicaServiceFilter; label: string }[] = [
  { id: 'todos', label: 'Todas las camas' },
  { id: 'uti', label: 'UTI' },
  { id: 'uci', label: 'UCI' },
  { id: 'mq', label: 'Medicina-quirúrgica' },
];

export type CicaServiceFilterChipsProps = {
  value: CicaServiceFilter;
  onChange: (value: CicaServiceFilter) => void;
  testId?: string;
};

/** Filtro servicio epis2g — SystemGlobalViews. */
export function CicaServiceFilterChips({
  value,
  onChange,
  testId = 'cica-service-filter',
}: CicaServiceFilterChipsProps) {
  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap data-testid={testId}>
      {FILTERS.map((filter) => (
        <Chip
          key={filter.id}
          size="small"
          label={filter.label}
          clickable
          color={value === filter.id ? 'primary' : 'default'}
          variant={value === filter.id ? 'filled' : 'outlined'}
          onClick={() => onChange(filter.id)}
          data-testid={`${testId}-${filter.id}`}
        />
      ))}
    </Stack>
  );
}

export function matchesCicaServiceFilter(
  locationText: string | undefined,
  filter: CicaServiceFilter,
): boolean {
  if (filter === 'todos') return true;
  const haystack = (locationText ?? '').toLowerCase();
  return haystack.includes(filter);
}
