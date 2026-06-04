import {
  checkAceInhibitorInPregnancy,
  checkBetaLactamAllergy,
  checkRenalDoseAdjustment,
} from '../original/rules.js';
import type { ClinicalSafetyInput, ClinicalSafetyResult } from '../original/types.js';

/** CDS demo read-only — no bloquea ni escribe clínica. */
export function evaluateClinicalSafety(input: ClinicalSafetyInput): ClinicalSafetyResult {
  const warnings = [
    ...checkBetaLactamAllergy(input),
    ...checkAceInhibitorInPregnancy(input),
    ...checkRenalDoseAdjustment(input),
  ];
  return {
    warnings,
    evaluatedAt: new Date().toISOString(),
    readOnly: true,
  };
}
