import MuiDialog, { type DialogProps } from '@mui/material/Dialog';

export type EpisDialogProps = DialogProps;

export function EpisDialog(props: EpisDialogProps) {
  return <MuiDialog {...props} />;
}
