import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const SUGGESTIONS = [
  'buscar paciente',
  'resume al paciente',
  'evoluciona al paciente',
  'prepara receta',
  'solicita laboratorio',
] as const;

export type CommandSuggestionChipsProps = {
  onSelect: (command: string) => void;
};

export function CommandSuggestionChips({ onSelect }: CommandSuggestionChipsProps) {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={1}
      justifyContent="center"
      data-testid="epis2-command-chips"
    >
      {SUGGESTIONS.map((cmd) => (
        <Chip
          key={cmd}
          label={cmd}
          variant="outlined"
          clickable
          onClick={() => onSelect(cmd)}
          sx={{ borderRadius: 999 }}
        />
      ))}
    </Stack>
  );
}
