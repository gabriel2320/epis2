import { copy } from '@epis2/design-system';
import {
  EpisButton,
  EpisDialog,
  EpisTextField,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { filterClinicalCommandPaletteItems } from './filterClinicalCommandPaletteItems.js';

export type ClinicalCommandPaletteItem = {
  id: string;
  label: string;
  group?: string;
  keywords?: string;
  onSelect: () => void;
  requiresConfirmation?: boolean;
};

export type ClinicalCommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  items: ClinicalCommandPaletteItem[];
  title?: string;
  maxVisible?: number;
  /** Misma resolución NL que la barra — Enter con texto libre. */
  onSubmitNaturalLanguage?: (text: string) => void;
};

/** Command palette MUI — refuerza `/comando` (cmdk en Fase A+ opcional). */
export function ClinicalCommandPalette({
  open,
  onClose,
  items,
  title = copy.clinicalProductivity.commandPaletteTitle,
  maxVisible = 8,
  onSubmitNaturalLanguage,
}: ClinicalCommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const filtered = useMemo(
    () => filterClinicalCommandPaletteItems(items, query, maxVisible),
    [items, maxVisible, query],
  );

  const run = (item: ClinicalCommandPaletteItem) => {
    if (item.requiresConfirmation) {
      const ok = window.confirm(
        copy.clinicalProductivity.confirmRiskyAction.replace('{action}', item.label),
      );
      if (!ok) return;
    }
    item.onSelect();
    onClose();
  };

  const handleQueryKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const text = query.trim();
    if (filtered.length === 1 && filtered[0]) {
      run(filtered[0]);
      return;
    }
    if (text && onSubmitNaturalLanguage) {
      onSubmitNaturalLanguage(text);
      onClose();
    }
  };

  return (
    <EpisDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      data-testid="epis2-clinical-command-palette"
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <EpisTextField
          autoFocus
          label={copy.clinicalProductivity.commandPaletteSearch}
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyDown={handleQueryKeyDown}
          placeholder={copy.commandCenter.powerBarPlaceholder}
          data-testid="epis2-command-palette-query"
        />
        <List dense>
          {filtered.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => run(item)}
              data-testid={`epis2-command-palette-item-${item.id}`}
            >
              <ListItemText
                primary={item.label}
                {...(item.group ? { secondary: item.group } : {})}
              />
            </ListItemButton>
          ))}
        </List>
        <EpisButton appearance="text" onClick={onClose}>
          {copy.clinicalProductivity.commandPaletteClose}
        </EpisButton>
      </Stack>
    </EpisDialog>
  );
}

export function useClinicalCommandPaletteShortcut(onOpen: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onOpen]);
}
