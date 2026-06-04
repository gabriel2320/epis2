import {
  checkAceInhibitorInPregnancy,
  checkBetaLactamAllergy,
  checkRenalDoseAdjustment,
} from './rules.js';
import type { ClinicalSafetyInput, ClinicalSafetyResult } from './types.js';

/** Evaluación CDS demo — solo informativa; la aprobación sigue siendo humana. */
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

export function formatSafetyWarningsForAssist(result: ClinicalSafetyResult): string {
  if (!result.warnings.length) {
    return 'Alertas de seguridad (demo): ninguna regla disparada en este contexto.';
  }
  return [
    'Alertas de seguridad (demo — revisión clínica obligatoria, no bloquean guardado):',
    ...result.warnings.map((w) => `- [${w.severity}] ${w.message}: ${w.detail}`),
  ].join('\n');
}
