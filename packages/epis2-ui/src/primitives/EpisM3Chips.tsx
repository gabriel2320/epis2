import { EpisChip, type EpisChipProps } from './EpisChip.js';

export type EpisAssistChipProps = Omit<EpisChipProps, 'variant'> & {
  selected?: boolean;
};

/** Assist chip M3 — sugerencias de comando. */
export function EpisAssistChip({ selected, sx, ...rest }: EpisAssistChipProps) {
  return (
    <EpisChip
      variant={selected ? 'filled' : 'outlined'}
      color={selected ? 'primary' : 'default'}
      sx={[{ fontWeight: 500 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...rest}
    />
  );
}

export type EpisFilterChipProps = Omit<EpisChipProps, 'variant'> & {
  active?: boolean;
};

/** Filter chip M3 — filtros de tablero. */
export function EpisFilterChip({ active, sx, ...rest }: EpisFilterChipProps) {
  return (
    <EpisChip
      variant={active ? 'filled' : 'outlined'}
      color={active ? 'primary' : 'default'}
      sx={[{ fontWeight: 500 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...rest}
    />
  );
}
