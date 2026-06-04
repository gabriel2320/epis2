import { getMvpCommandChips } from '@epis2/command-registry';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export type CommandSuggestionChipsProps = {
  onSelect: (command: string) => void;
};

export function CommandSuggestionChips({ onSelect }: CommandSuggestionChipsProps) {
  const chips = getMvpCommandChips();

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={1}
      justifyContent="center"
      data-testid="epis2-command-chips"
    >
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          label={chip.sampleEs}
          variant="outlined"
          clickable
          onClick={() => onSelect(chip.sampleEs)}
          sx={{ borderRadius: 999 }}
        />
      ))}
    </Stack>
  );
}
