import { checkAceInhibitorInPregnancy, checkBetaLactamAllergy, checkRenalDoseAdjustment } from "./rules.js";
import type { ClinicalSafetyInput, ClinicalSafetyResult } from "./types.js";

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

export function formatSafetyWarningsForPrompt(result: ClinicalSafetyResult): string {
  if (!result.warnings.length) {
    return "ALERTAS DE SEGURIDAD (demo CDS): ninguna regla disparada en este contexto.";
  }
  return [
    "ALERTAS DE SEGURIDAD (demo CDS — no bloqueantes, revisión clínica obligatoria):",
    ...result.warnings.map((w) => `- [${w.severity}] ${w.message}: ${w.detail}`),
  ].join("\n");
}
