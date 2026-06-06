import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { EpisChip, type EpisChipProps } from '../primitives/EpisChip.js';

export type EpisDemoBadgeChipProps = Omit<EpisChipProps, 'label'> & {
  label: string;
};

/** Chip demo alineado al esquema cromático activo (sin warning fijo). */
export function EpisDemoBadgeChip({ sx, ...rest }: EpisDemoBadgeChipProps) {
  const theme = useTheme();
  const demo = theme.epis2?.visual.demoBadgeChip;

  const themedSx: SxProps<Theme> = {
    fontWeight: 600,
    borderColor: demo?.borderColor ?? 'divider',
    color: demo?.color ?? 'text.secondary',
    bgcolor: demo?.bgcolor ?? 'action.hover',
    ...(typeof sx === 'object' && !Array.isArray(sx) ? sx : {}),
  };

  return <EpisChip size="small" variant="outlined" sx={themedSx} {...rest} />;
}

/** Sx reutilizable para chips demo en componentes legacy. */
export function epis2DemoBadgeChipSx(theme: Theme): SxProps<Theme> {
  const demo = theme.epis2?.visual.demoBadgeChip;
  return {
    fontWeight: 600,
    borderColor: demo?.borderColor ?? theme.palette.divider,
    color: demo?.color ?? theme.palette.text.secondary,
    bgcolor: demo?.bgcolor ?? theme.palette.action.hover,
  };
}
