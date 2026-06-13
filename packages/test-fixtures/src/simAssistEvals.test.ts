import { describe, expect, it } from 'vitest';
import { SIM_CLINICAL_CASES } from './simCases.js';
import {
  SIM_ASSIST_EVAL_MATRIX,
  assertSimAssistEvalMatrix,
  resolveSimAssistEvalEntry,
  simAssistEvalPatientId,
} from './simAssistEvals.js';

describe('SIM_ASSIST_EVAL_MATRIX (MF-CASE-10/11)', () => {
  it('matriz cubre todos los casos SIM del catálogo', () => {
    expect(assertSimAssistEvalMatrix()).toEqual([]);
    expect(SIM_ASSIST_EVAL_MATRIX.length).toBeGreaterThanOrEqual(SIM_CLINICAL_CASES.length);
  });

  it('resuelve paciente HTA para evolution_note', () => {
    const entry = resolveSimAssistEvalEntry('SIM-HIPERTENSI-N-ac1e', 'evolution_note');
    expect(entry?.context.tier).toBe('L0_synthetic');
    expect(simAssistEvalPatientId('SIM-HIPERTENSI-N-ac1e')).toMatch(/^a0000002-/);
  });
});
