import MuiChip, { type ChipProps } from '@mui/material/Chip';

export type EpisChipProps = ChipProps;

export function EpisChip(props: EpisChipProps) {
  return <MuiChip {...props} />;
}
