/**
 * MF-CASE-10/11: matriz assist × casos SIM (sin PHI).
 * Usada por golden journey API y `npm run ai:evals:sim` (live, requiere dev:ai).
 */

import { getSimCaseByCode, SIM_CLINICAL_CASES } from './simClinicalCases.js';

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
    caseCode: 'SIM-FIBRILACI-N--80e0',
    blueprintId: 'prescription',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'fa_anticoagulacion' },
  },
  {
    caseCode: 'SIM-OBESIDAD-SIN-a015',
    blueprintId: 'lab_request',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'obesidad_labs' },
  },
  {
    caseCode: 'SIM-DISLIPIDEMIA-cd13',
    blueprintId: 'prescription',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'dislipidemia_estatinas' },
  },
  {
    caseCode: 'SIM-EPOC-MODERAD-2b2f',
    blueprintId: 'nursing_note',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'epoc_enfermeria' },
  },
  {
    caseCode: 'SIM-INSUFICIENCI-cd9f',
    blueprintId: 'discharge_summary',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'icc_alta' },
  },
  {
    caseCode: 'SIM-ASTHMA-c6be',
    blueprintId: 'evolution_note',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'asma_docente' },
  },
  {
    caseCode: 'SIM-TRASTORNO-DE-9437',
    blueprintId: 'evolution_note',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'depresion_seguimiento' },
  },
  {
    caseCode: 'SIM-ENFERMEDAD-R-40f8',
    blueprintId: 'lab_request',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'erc_estadio3' },
  },
  {
    caseCode: 'SIM-DIABETES-81dd',
    blueprintId: 'pharmacy_validation',
    context: { eval: 'sim', tier: 'L0_synthetic', focus: 'dm2_farmacia' },
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
  if (SIM_ASSIST_EVAL_MATRIX.length < SIM_CLINICAL_CASES.length) {
    errors.push(
      `matriz debe tener >= ${SIM_CLINICAL_CASES.length} entradas (actual: ${SIM_ASSIST_EVAL_MATRIX.length})`,
    );
  }
  const covered = new Set(SIM_ASSIST_EVAL_MATRIX.map((e) => e.caseCode));
  for (const sim of SIM_CLINICAL_CASES) {
    if (!covered.has(sim.demoCaseCode)) {
      errors.push(`sin entrada assist para ${sim.demoCaseCode}`);
    }
  }
  return errors;
}
