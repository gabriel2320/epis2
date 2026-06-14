import { describe, expect, it } from 'vitest';
import { resolvePostSaveMicrojourneys } from './postSaveMicrojourneys.js';

const PATIENT = 'a0000001-0000-4000-8000-000000000001';

describe('postSaveMicrojourneys (MF-DI-09)', () => {
  it('post-receta: imprimir e historial', () => {
    const actions = resolvePostSaveMicrojourneys({
      blueprintId: 'prescription',
      patientId: PATIENT,
    });
    expect(actions.map((a) => a.id)).toEqual(['print_rx', 'view_history']);
  });

  it('post-evolución: receta asociada', () => {
    const actions = resolvePostSaveMicrojourneys({
      blueprintId: 'evolution_note',
      patientId: PATIENT,
    });
    expect(actions[0]?.id).toBe('linked_rx');
  });

  it('post-lab: panel frecuente DM2', () => {
    const actions = resolvePostSaveMicrojourneys({
      blueprintId: 'lab_request',
      patientId: PATIENT,
      summaryFields: { activeProblems: 'Diabetes mellitus tipo 2' },
    });
    expect(actions[0]?.search?.studyHint).toMatch(/HbA1c/);
  });
});
