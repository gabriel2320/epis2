import { describe, expect, it } from 'vitest';
import { getBlueprintById } from '../registry.js';
import { transferNoteBlueprint } from './transfer-note.js';

describe('transferNoteBlueprint', () => {
  it('registrado con intent transfer_patient', () => {
    expect(getBlueprintById('transfer_note')).toBe(transferNoteBlueprint);
    expect(transferNoteBlueprint.routePath).toBe('/espacio/traslado');
    expect(transferNoteBlueprint.intentIds).toContain('transfer_patient');
  });
});
