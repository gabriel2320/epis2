import { describe, expect, it } from 'vitest';
import { safePatientExportSlug } from './summaryExport.js';

describe('safePatientExportSlug', () => {
  it('elimina tildes y caracteres no ASCII para cabeceras HTTP', () => {
    expect(safePatientExportSlug('Paciente Demo — Jorge Pérez')).toBe(
      'paciente-demo-jorge-perez',
    );
  });
});
