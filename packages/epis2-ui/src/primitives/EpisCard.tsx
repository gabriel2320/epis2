import MuiPaper, { type PaperProps } from '@mui/material/Paper';

export type EpisCardProps = PaperProps;

/** Tarjeta clínica — Paper con bordes del tema. */
export function EpisCard({ variant = 'outlined', ...props }: EpisCardProps) {
  return <MuiPaper variant={variant} {...props} />;
}
