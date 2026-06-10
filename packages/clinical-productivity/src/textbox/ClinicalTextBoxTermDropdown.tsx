import { copy } from '@epis2/design-system';
import { List, ListItemButton, ListItemText, Paper, Typography } from '@epis2/epis2-ui';
import type { ChileClinicalTerm } from '../dictionaries/chileClinicalDictionary.js';

export type ClinicalTextBoxTermDropdownProps = {
  terms: readonly ChileClinicalTerm[];
  visible: boolean;
  testId: string;
  onSelect: (term: ChileClinicalTerm) => void;
};

function termLabel(term: ChileClinicalTerm): string {
  const detail = term.formal ?? term.expansions?.[0];
  return detail && detail !== term.term ? `${term.term} → ${detail}` : term.term;
}

/** Dropdown sobrio MD3 — máx. 5 sugerencias del diccionario chileno. */
export function ClinicalTextBoxTermDropdown({
  terms,
  visible,
  testId,
  onSelect,
}: ClinicalTextBoxTermDropdownProps) {
  if (!visible || terms.length === 0) return null;

  return (
    <Paper
      elevation={2}
      data-testid={testId}
      sx={{
        position: 'absolute',
        zIndex: 2,
        left: 0,
        right: 0,
        mt: 0.5,
        maxHeight: 180,
        overflow: 'auto',
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 1.5, pt: 1, display: 'block' }}
      >
        {copy.clinicalProductivity.textBoxTermSuggestions}
      </Typography>
      <List dense disablePadding>
        {terms.map((term) => (
          <ListItemButton
            key={term.id}
            data-testid={`${testId}-option-${term.id}`}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(term);
            }}
          >
            <ListItemText
              primary={termLabel(term)}
              secondary={
                term.category === 'medication' || term.category === 'unit'
                  ? copy.clinicalProductivity.textBoxTermRequiresConfirm
                  : term.category
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
