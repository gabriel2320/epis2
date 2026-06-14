import { describe, expect, it } from 'vitest';
import {
  DM2_LAB_CONTROL_PANEL,
  detectChronicFocus,
  evolutionSubjectiveForControl,
  parseFirstActiveMedicationLine,
} from './chronic-control-prefill.js';

describe('chronic-control-prefill (MF-DI-04)', () => {
  it('detecta foco DM2 desde problemas activos', () => {
    expect(
      detectChronicFocus({ activeProblems: 'Diabetes mellitus tipo 2 (sintético)' }, undefined),
    ).toBe('dm2');
  });

  it('prioriza hint control diabetes en evolución', () => {
    expect(evolutionSubjectiveForControl('dm2', 'Control diabetes mellitus tipo 2')).toBe(
      'Control diabetes mellitus tipo 2.',
    );
  });

  it('parsea primera medicación del resumen', () => {
    expect(
      parseFirstActiveMedicationLine('Metformina 850 mg c/12 h · Atorvastatina (demo)'),
    ).toEqual({
      name: 'Metformina',
      dose: '850 mg',
      frequency: 'c/12 h',
    });
  });

  it('panel laboratorio DM2 incluye HbA1c', () => {
    expect(DM2_LAB_CONTROL_PANEL).toContain('HbA1c');
  });
});
