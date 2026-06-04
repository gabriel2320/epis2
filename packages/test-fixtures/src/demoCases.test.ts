import { describe, expect, it } from 'vitest';
import {
  DEMO_CLINICAL_CASES,
  SYNTHETIC_LABEL,
  assertDemoCasesInvariants,
  getDemoCaseByCode,
  getDemoCaseByPatientId,
} from './demoCases.js';

describe('DEMO_CLINICAL_CASES (EPIS2-09)', () => {
  it('define 5 casos sintéticos completos', () => {
    expect(DEMO_CLINICAL_CASES).toHaveLength(5);
    expect(assertDemoCasesInvariants()).toEqual([]);
  });

  it('usa etiqueta DEMO/SINTÉTICO', () => {
    expect(SYNTHETIC_LABEL).toBe('DEMO/SINTÉTICO');
  });

  it('resuelve por código y por UUID', () => {
    expect(getDemoCaseByCode('DEMO-003')?.scenario).toContain('pediátr');
    expect(getDemoCaseByPatientId('a0000001-0000-4000-8000-000000000005')?.demoCaseCode).toBe(
      'DEMO-005',
    );
  });
});
