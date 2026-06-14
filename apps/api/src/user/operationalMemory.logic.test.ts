import { describe, expect, it } from 'vitest';
import {
  applyOperationalMemoryPatch,
  mergeRecentPatients,
  parseGlobalPayload,
} from './operationalMemory.logic.js';

describe('operationalMemory.logic (MF-DI-02)', () => {
  it('mergeRecentPatients mantiene máximo 5 sin duplicados', () => {
    const base = Array.from({ length: 5 }, (_, i) => ({
      id: `00000000-0000-4000-8000-00000000000${i + 1}`,
      displayName: `Paciente ${i + 1}`,
    }));
    const merged = mergeRecentPatients(base, {
      id: '00000000-0000-4000-8000-000000000003',
      displayName: 'Paciente 3 actualizado',
    });
    expect(merged).toHaveLength(5);
    expect(merged[0]?.displayName).toBe('Paciente 3 actualizado');
  });

  it('parseGlobalPayload tolera payload vacío', () => {
    expect(parseGlobalPayload(null).recentPatients).toEqual([]);
  });

  it('applyOperationalMemoryPatch persiste sección tradicional', () => {
    const result = applyOperationalMemoryPatch(
      parseGlobalPayload({}),
      {},
      { traditionalSection: 'navMeds' },
    );
    expect(result.patient.traditionalSection).toBe('navMeds');
  });
});
