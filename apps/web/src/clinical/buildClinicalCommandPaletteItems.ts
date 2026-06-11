import {
  filterDefinitionsForRole,
  requiresConfirmation,
  type CommandDefinition,
} from '@epis2/command-registry';
import type { ClinicalCommandPaletteItem } from '@epis2/clinical-productivity';

const CATEGORY_LABELS: Record<string, string> = {
  search: 'Búsqueda',
  documentation: 'Documentación',
  orders: 'Indicaciones',
  review: 'Revisión',
  pharmacy: 'Farmacia',
  discharge: 'Alta',
  navigation: 'Navegación',
  assist: 'Asistencia',
};

function commandTextForDefinition(def: CommandDefinition): string {
  return def.examples[0] ?? def.aliasesEs[0] ?? def.labelEs;
}

/** Texto NL canónico para barra y paleta (MF-CM-02). */
export function clinicalCommandTextForDefinition(def: CommandDefinition): string {
  return commandTextForDefinition(def);
}

function keywordsForDefinition(def: CommandDefinition): string {
  return [def.labelEs, ...def.aliasesEs, ...def.examples].join(' ');
}

export function buildClinicalCommandPaletteItems(
  role: string,
  permissions: readonly string[],
  onRunCommand: (text: string) => void,
  maxItems = 24,
): ClinicalCommandPaletteItem[] {
  return filterDefinitionsForRole(role, permissions)
    .slice()
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxItems)
    .map((def) => ({
      id: def.intent,
      label: def.labelEs,
      group: CATEGORY_LABELS[def.category] ?? def.category,
      keywords: keywordsForDefinition(def),
      requiresConfirmation: requiresConfirmation(def.intent),
      onSelect: () => onRunCommand(commandTextForDefinition(def)),
    }));
}
