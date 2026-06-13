import { describe, expect, it } from 'vitest';
import type { TeachingCasePayload } from './sources/meded.js';
import { sanitizeTeachingCasePayload } from './sanitize.js';

const safeCase: TeachingCasePayload = {
  resourceType: 'TeachingCase',
  id: 'meded-fixture-test-001',
  title: 'Caso docente de prueba',
  license: 'CC BY 4.0 (rewrite sintético EPIS2)',
  patient: { birthDate: '1990-01-01', sex: 'F' },
  presentation: 'Paciente con síntomas leves (sintético)',
  diagnoses: ['Asthma'],
};

describe('clinical-case-intel sanitize', () => {
  it('acepta TeachingCase sintético válido', () => {
    expect(sanitizeTeachingCasePayload(safeCase)).toEqual([]);
  });

  it('rechaza email en payload', () => {
    const issues = sanitizeTeachingCasePayload({
      ...safeCase,
      presentation: 'Contactar a test@example.com (sintético)',
    });
    expect(issues.some((i) => i.message.includes('email'))).toBe(true);
  });

  it('rechaza id sin prefijo meded/pmc', () => {
    const issues = sanitizeTeachingCasePayload({ ...safeCase, id: 'patient-real-001' });
    expect(issues.some((i) => i.field === 'id')).toBe(true);
  });
});
