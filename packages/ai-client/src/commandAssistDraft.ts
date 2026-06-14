/** Intents de formulario borrador invocables con assist desde barra (MF-CM-06 / MF-FF-11). */
export const COMMAND_ASSIST_DRAFT_INTENTS = new Set([
  'create_evolution_draft',
  'prepare_discharge_draft',
  'prepare_prescription',
  'request_laboratory',
  'request_referral',
  'request_imaging',
  'request_procedure',
  'create_nursing_note',
  'record_medication_administration',
  'prepare_pharmacy_review',
  'reconcile_medications',
  'create_medical_certificate',
  'create_outpatient_visit',
  'register_allergy',
  'register_problem',
]);

export const INTENT_TO_ASSIST_BLUEPRINT: Record<string, string> = {
  create_evolution_draft: 'evolution_note',
  prepare_discharge_draft: 'discharge_summary',
  prepare_prescription: 'prescription',
  request_laboratory: 'lab_request',
  request_referral: 'referral',
  request_imaging: 'imaging_request',
  request_procedure: 'procedure_request',
  create_nursing_note: 'nursing_note',
  record_medication_administration: 'medication_administration',
  prepare_pharmacy_review: 'pharmacy_validation',
  reconcile_medications: 'medication_reconciliation',
  create_outpatient_visit: 'outpatient_visit',
  create_medical_certificate: 'medical_certificate',
  register_allergy: 'allergy_entry',
  register_problem: 'clinical_problem_entry',
};

export const COMMAND_ASSIST_DRAFT_STORAGE_PREFIX = 'epis2-command-assist-draft:';

export type StashedCommandAssistDraft = {
  fields: Record<string, string>;
  runId?: string | undefined;
  at: number;
};

export function resolveAssistBlueprintForIntent(intent: string): string | undefined {
  return INTENT_TO_ASSIST_BLUEPRINT[intent];
}

export function shouldInvokeCommandAssistDraft(intent: string, aiAvailable: boolean): boolean {
  if (!aiAvailable) return false;
  return COMMAND_ASSIST_DRAFT_INTENTS.has(intent);
}

export function stashCommandAssistDraft(
  blueprintId: string,
  fields: Record<string, string>,
  runId?: string | undefined,
): void {
  if (typeof sessionStorage === 'undefined') return;
  const payload: StashedCommandAssistDraft = { fields, at: Date.now() };
  if (runId) payload.runId = runId;
  sessionStorage.setItem(
    `${COMMAND_ASSIST_DRAFT_STORAGE_PREFIX}${blueprintId}`,
    JSON.stringify(payload),
  );
}

export function consumeCommandAssistDraft(blueprintId: string): StashedCommandAssistDraft | null {
  if (typeof sessionStorage === 'undefined') return null;
  const key = `${COMMAND_ASSIST_DRAFT_STORAGE_PREFIX}${blueprintId}`;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  sessionStorage.removeItem(key);
  try {
    const parsed = JSON.parse(raw) as StashedCommandAssistDraft;
    if (!parsed.fields || typeof parsed.fields !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}
