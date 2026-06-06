import { getAssistBlueprintFields } from './assistSchemas.js';
import { getDraftPromptSpec } from './draftPromptCatalog.js';

export type AssistPatternResult =
  | { ok: true; blueprintId: string }
  | { ok: false; blueprintId: string; missing: string[] };

/** Verifica paridad assistSchemas + draftPromptCatalog (MF-188). */
export function assertAssistBlueprintPattern(blueprintId: string): AssistPatternResult {
  const missing: string[] = [];
  const fields = getAssistBlueprintFields(blueprintId);
  if (!fields || fields.length === 0) {
    missing.push('ASSIST_BLUEPRINT_FIELDS');
  }
  const prompt = getDraftPromptSpec(blueprintId);
  if (!prompt) {
    missing.push('DRAFT_PROMPT_CATALOG');
  }
  if (missing.length > 0) {
    return { ok: false, blueprintId, missing };
  }
  return { ok: true, blueprintId };
}

export const ASSIST_ENABLED_BLUEPRINT_IDS = [
  'evolution_note',
  'discharge_summary',
  'prescription',
  'lab_request',
  'nursing_note',
  'medication_administration',
  'pharmacy_validation',
  'admission_note',
  'allergy_entry',
  'clinical_problem_entry',
  'medication_reconciliation',
  'transfer_note',
  'outpatient_visit',
  'referral_report',
] as const;

export function listAssistPatternGaps(): AssistPatternResult[] {
  return ASSIST_ENABLED_BLUEPRINT_IDS.map(assertAssistBlueprintPattern).filter(
    (r): r is Extract<AssistPatternResult, { ok: false }> => !r.ok,
  );
}
