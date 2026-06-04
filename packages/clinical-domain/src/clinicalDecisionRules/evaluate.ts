import { evaluateClinicalSafety } from '../clinicalSafety/evaluate.js';
import type { ClinicalSafetyInput, ClinicalSafetyResult } from '../clinicalSafety/types.js';
import { buildCdrContextFromSafetyInput } from './fromSafetyInput.js';
import { evaluateClinicalDecisionRules } from './rules.js';
import { cdrResultsToSafetyWarnings } from './toSafetyWarnings.js';

/** CDS demo + CDR EPIONE en modo read-only para asistencia y UI. */
export function evaluateDemoClinicalAlerts(
  input: ClinicalSafetyInput,
  options?: {
    blueprintId?: string;
    currentFields?: Record<string, string>;
  },
): ClinicalSafetyResult {
  const cds = evaluateClinicalSafety(input);
  const cdrOpts: Parameters<typeof buildCdrContextFromSafetyInput>[1] = {};
  if (options?.blueprintId !== undefined) cdrOpts.blueprintId = options.blueprintId;
  if (options?.currentFields !== undefined) cdrOpts.currentFields = options.currentFields;
  const cdrCtx = buildCdrContextFromSafetyInput(input, cdrOpts);
  const cdrWarnings = cdrResultsToSafetyWarnings(evaluateClinicalDecisionRules(cdrCtx));

  return {
    warnings: [...cds.warnings, ...cdrWarnings],
    evaluatedAt: new Date().toISOString(),
    readOnly: true,
  };
}
