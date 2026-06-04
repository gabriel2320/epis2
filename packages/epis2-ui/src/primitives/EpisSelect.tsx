import MuiSelect, { type SelectProps } from '@mui/material/Select';

export type EpisSelectProps = SelectProps;

export function EpisSelect(props: EpisSelectProps) {
  return <MuiSelect {...props} />;
}
