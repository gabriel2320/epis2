import { describe, expect, it } from 'vitest';
import { EPIS2_FORM_BLUEPRINTS } from './registry.js';
import {
  blueprintExportFilename,
  parseBlueprintImport,
  serializeBlueprintToJson,
} from './blueprint-io.js';

describe('blueprint-io', () => {
  it('exporta e importa un blueprint del registry sin errores', () => {
    const source = EPIS2_FORM_BLUEPRINTS[0]!;
    const json = serializeBlueprintToJson(source);
    const result = parseBlueprintImport(json);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document.blueprint.blueprintId).toBe(source.blueprintId);
      expect(result.document.schemaVersion).toBe(1);
    }
  });

  it('rechaza JSON inválido y blueprints incompletos', () => {
    expect(parseBlueprintImport('{bad')).toEqual({ ok: false, errors: ['JSON inválido'] });
    expect(parseBlueprintImport('{}')).toEqual({
      ok: false,
      errors: expect.arrayContaining(['blueprint.blueprintId requerido']),
    });
  });

  it('genera nombre de archivo estable', () => {
    expect(blueprintExportFilename('evolution_note')).toBe('epis2-blueprint-evolution_note.json');
  });
});
