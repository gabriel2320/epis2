import { describe, expect, it } from 'vitest';
import {
  SIM_ASSIST_EVAL_MATRIX,
  assertSimAssistEvalMatrix,
  resolveSimAssistEvalEntry,
  simAssistEvalPatientId,
} from './simAssistEvals.js';

describe('SIM_ASSIST_EVAL_MATRIX (MF-CASE-10)', () => {
  it('matriz piloto válida y alineada con SIM_CLINICAL_CASES', () => {
    expect(assertSimAssistEvalMatrix()).toEqual([]);
    expect(SIM_ASSIST_EVAL_MATRIX.length).toBeGreaterThanOrEqual(4);
  });

  it('resuelve paciente HTA para evolution_note', () => {
    const entry = resolveSimAssistEvalEntry('SIM-HIPERTENSI-N-ac1e', 'evolution_note');
    expect(entry?.context.tier).toBe('L0_synthetic');
    expect(simAssistEvalPatientId('SIM-HIPERTENSI-N-ac1e')).toMatch(/^a0000002-/);
  });
});
