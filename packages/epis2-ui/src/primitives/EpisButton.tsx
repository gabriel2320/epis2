import MuiButton, { type ButtonProps } from '@mui/material/Button';

export type EpisButtonProps = ButtonProps;

/** Botón EPIS2 — MUI Button con tema central. */
export function EpisButton(props: EpisButtonProps) {
  return <MuiButton {...props} />;
}
