/**
 * MF-CASE-10: matriz piloto assist × casos SIM (sin PHI).
 * Usada por golden journey API y `npm run ai:evals:sim` (live, requiere dev:ai).
 */

import { getSimCaseByCode } from './simCases.js';

export type SimAssistBlueprintId =
  | 'evolution_note'
  | 'prescription'
  | 'nursing_note'
  | 'discharge_summary'
  | 'pharmacy_validation'
  | 'lab_request';

export type SimAssistEvalEntry = {
  caseCode: string;
  blueprintId: SimAssistBlueprintId;
  /** Contexto mínimo para local-ai (tier L0_synthetic). */
  context: Record<string, string>;
};

export const SIM_ASSIST_EVAL_MATRIX: SimAssistEvalEntry[] = [
  {
    caseCode: 'SIM-HIPERTENSI-N-ac1e',
    blueprintId: 'evolution_note',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'hta_ambulatoria' },
  },
  {
    caseCode: 'SIM-DIABETES-81dd',
    blueprintId: 'prescription',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'dm2_control' },
  },
  {
    caseCode: 'SIM-ASMA-BRONQUI-d583',
    blueprintId: 'nursing_note',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'asma_control' },
  },
  {
    caseCode: 'SIM-NEUMON-A-ADQ-e60b',
    blueprintId: 'discharge_summary',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'neumonia_alta' },
  },
  {
    caseCode: 'SIM-DIABETES-81dd',
    blueprintId: 'pharmacy_validation',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'dm2_farmacia' },
  },
  {
    caseCode: 'SIM-TRASTORNO-DE-9437',
    blueprintId: 'evolution_note',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'depresion_seguimiento' },
  },
];

export function resolveSimAssistEvalEntry(
  caseCode: string,
  blueprintId: SimAssistBlueprintId,
): SimAssistEvalEntry | undefined {
  return SIM_ASSIST_EVAL_MATRIX.find(
    (e) => e.caseCode === caseCode && e.blueprintId === blueprintId,
  );
}

export function simAssistEvalPatientId(caseCode: string): string | undefined {
  return getSimCaseByCode(caseCode)?.patientId;
}

export function assertSimAssistEvalMatrix(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const entry of SIM_ASSIST_EVAL_MATRIX) {
    const key = `${entry.caseCode}:${entry.blueprintId}`;
    if (seen.has(key)) errors.push(`entrada duplicada: ${key}`);
    seen.add(key);
    const sim = getSimCaseByCode(entry.caseCode);
    if (!sim) errors.push(`caseCode ausente en SIM_CLINICAL_CASES: ${entry.caseCode}`);
    if (entry.context.tier !== 'L0_synthetic') {
      errors.push(`${entry.caseCode}: tier debe ser L0_synthetic`);
    }
  }
  if (SIM_ASSIST_EVAL_MATRIX.length < 4) {
    errors.push('matriz piloto debe tener >= 4 entradas');
  }
  return errors;
}
