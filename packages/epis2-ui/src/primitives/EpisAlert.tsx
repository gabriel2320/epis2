import MuiAlert, { type AlertProps } from '@mui/material/Alert';

export type EpisAlertProps = AlertProps;

export function EpisAlert(props: EpisAlertProps) {
  return <MuiAlert {...props} />;
}
