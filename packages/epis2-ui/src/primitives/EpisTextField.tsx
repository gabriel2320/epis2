import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';

export type EpisTextFieldProps = TextFieldProps;

/** Campo de texto EPIS2 — fullWidth y variant outlined por defecto (tema). */
export function EpisTextField(props: EpisTextFieldProps) {
  return <MuiTextField {...props} />;
}
