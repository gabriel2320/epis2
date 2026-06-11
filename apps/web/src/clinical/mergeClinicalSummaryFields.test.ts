import { describe, expect, it } from 'vitest';
import { mergeClinicalSummaryFields } from './mergeClinicalSummaryFields.js';

describe('mergeClinicalSummaryFields', () => {
  it('prioriza agregados SQL sobre demo context', () => {
    const merged = mergeClinicalSummaryFields(
      { activeProblems: 'Demo', activeMedications: 'Demo meds' },
      {
        patientId: 'a0000001-0000-4000-8000-000000000001',
        displayName: 'Paciente',
        birthDate: '1980-01-01',
        sex: 'M',
        edadAnios: 46,
        previsionResumen: 'FONASA tramo C',
        alergiasCriticas: 'Penicilina',
        problemasActivos: 'HTA activa',
        medicamentosActivos: 'Losartán 50 mg',
        ultimoEncuentroAt: '2026-06-11T10:00:00.000Z',
        hospitalizado: true,
        refreshedAt: '2026-06-11T12:00:00.000Z',
      },
    );

    expect(merged.activeProblems).toBe('HTA activa');
    expect(merged.activeMedications).toBe('Losartán 50 mg');
    expect(merged.coveragePrevision).toBe('FONASA tramo C');
    expect(merged.clinicalAlerts).toContain('Penicilina');
    expect(merged.recentEvents).toContain('Último encuentro');
  });

  it('devuelve base si no hay SQL', () => {
    expect(mergeClinicalSummaryFields({ activeProblems: 'X' }, null)).toEqual({
      activeProblems: 'X',
    });
  });
});
