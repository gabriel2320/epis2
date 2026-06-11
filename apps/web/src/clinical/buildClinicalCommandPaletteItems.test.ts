import { describe, expect, it, vi } from 'vitest';
import {
  buildClinicalCommandPaletteItems,
  clinicalCommandTextForDefinition,
} from './buildClinicalCommandPaletteItems.js';
import { filterDefinitionsForRole } from '@epis2/command-registry';

describe('buildClinicalCommandPaletteItems', () => {
  it('filtra por rol médico y ejecuta texto de comando', () => {
    const run = vi.fn();
    const items = buildClinicalCommandPaletteItems('physician', ['command.execute'], run);

    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item) => item.id === 'create_evolution_draft')).toBe(true);

    const evolution = items.find((item) => item.id === 'create_evolution_draft');
    evolution?.onSelect();
    expect(run).toHaveBeenCalled();
  });

  it('marca confirmación en acciones con metadata de riesgo', () => {
    const items = buildClinicalCommandPaletteItems('physician', ['command.execute'], vi.fn());
    const risky = items.filter((item) => item.requiresConfirmation);
    expect(risky.length).toBeGreaterThan(0);
  });

  it('onSelect usa el mismo texto NL que clinicalCommandTextForDefinition', () => {
    const run = vi.fn();
    const defs = filterDefinitionsForRole('physician', ['command.execute']);
    const def = defs.find((d) => d.intent === 'create_evolution_draft');
    expect(def).toBeDefined();

    const items = buildClinicalCommandPaletteItems('physician', ['command.execute'], run);
    const evolution = items.find((item) => item.id === 'create_evolution_draft');
    evolution?.onSelect();

    expect(run).toHaveBeenCalledWith(clinicalCommandTextForDefinition(def!));
  });
});
