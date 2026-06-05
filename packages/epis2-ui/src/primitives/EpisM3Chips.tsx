import { useTheme } from '@mui/material/styles';
import type { IntentChipTone } from '../command/intent-visual.js';
import { intentChipToneSx } from '../theme/chip-tones.js';
import { EpisChip, type EpisChipProps } from './EpisChip.js';

export type EpisAssistChipProps = Omit<EpisChipProps, 'variant'> & {
  selected?: boolean;
  /** Paleta temática por tipo de comando. */
  tone?: IntentChipTone;
};

/** Assist chip M3 — sugerencias de comando. */
export function EpisAssistChip({ selected, tone, sx, ...rest }: EpisAssistChipProps) {
  const theme = useTheme();
  const toneSx = tone ? intentChipToneSx(tone, theme) : undefined;

  return (
    <EpisChip
      variant={selected ? 'filled' : 'outlined'}
      {...(tone ? {} : { color: selected ? 'primary' : 'default' })}
      sx={[
        {
          fontWeight: 600,
          height: 'auto',
          maxWidth: '100%',
          '& .MuiChip-label': {
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
            lineHeight: 1.45,
          },
        },
        toneSx,
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
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
