import MuiIconButton, { type IconButtonProps } from '@mui/material/IconButton';
import { epis2M3TouchTargetMinPx } from '../theme/m3-layout-tokens.js';

export type EpisIconButtonProps = IconButtonProps;

/** Icon button M3 — área táctil mínima 48×48 dp. */
export function EpisIconButton({ sx, ...props }: EpisIconButtonProps) {
  return (
    <MuiIconButton
      sx={{
        minWidth: epis2M3TouchTargetMinPx,
        minHeight: epis2M3TouchTargetMinPx,
        ...sx,
      }}
      {...props}
    />
  );
}
