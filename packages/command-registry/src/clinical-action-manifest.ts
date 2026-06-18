import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { getSecureCommandMeta } from './intent-metadata.js';
import type { ClinicalIntent, CommandDefinition } from './types.js';

/**
 * MF-LX-01 — Mapa intent → pantalla CICA (id en EPIS_CICA_SCREEN_REGISTRY).
 * Única fuente en command-registry; gate valida drift con epis2-ui registry.
 */
export const INTENT_CICA_SCREEN_IDS: Partial<Record<ClinicalIntent, string>> = {
  search_patient: 'patient-search',
  open_patient_chart: 'patient-summary',
  summarize_patient: 'patient-summary',
  create_evolution_draft: 'new-evolution',
  prepare_discharge_draft: 'new-epicrisis',
  prepare_prescription: 'new-prescription',
  request_laboratory: 'patient-exams',
  request_referral: 'patient-interconsultas',
  request_imaging: 'patient-exams',
  request_procedure: 'patient-procedures',
  create_nursing_note: 'patient-evolutions',
  record_medication_administration: 'patient-orders',
  prepare_pharmacy_review: 'patient-medications',
  admit_patient_hospital: 'patient-admission',
  open_results_inbox: 'patient-exams',
  reconcile_medications: 'patient-medications',
  transfer_patient: 'patient-admission',
  create_outpatient_visit: 'patient-summary',
  create_medical_certificate: 'new-document',
  respond_referral: 'patient-interconsultas',
  register_allergy: 'patient-summary',
  register_problem: 'patient-summary',
  paper_order_soap: 'new-evolution',
  paper_summarize_24h: 'patient-summary',
  paper_prepare_print: 'paper-book',
  paper_prepare_discharge_draft: 'new-epicrisis',
  paper_create_prescription_a5: 'new-prescription',
  paper_detect_pending: 'patient-summary',
  paper_planner_summarize_day: 'paper-day',
  paper_planner_print_agenda: 'paper-book',
  paper_planner_review_pending: 'patient-summary',
};

/** Intents del flujo dorado CICA — deben tener pantalla mapeada. */
export const GOLDEN_CICA_INTENTS: readonly ClinicalIntent[] = [
  'search_patient',
  'open_patient_chart',
  'create_evolution_draft',
  'prepare_prescription',
  'prepare_discharge_draft',
  'create_medical_certificate',
] as const;

export type ClinicalActionContract = {
  id: ClinicalIntent;
  label: string;
  synonyms: readonly string[];
  requiresPatient: boolean;
  requiredPermission: CommandDefinition['requiredPermission'];
  blueprintId?: string;
  draftType?: string;
  legacyRoutePath: string;
  cicaScreenId?: string;
  printable: boolean;
  /** IA-last: true solo si la acción exige assist LLM (ninguna en MF-LX-01). */
  aiRequired: false;
  actionType: ReturnType<typeof getSecureCommandMeta>['actionType'];
  safetyLevel: ReturnType<typeof getSecureCommandMeta>['safetyLevel'];
  category: ReturnType<typeof getSecureCommandMeta>['category'];
};

export function buildClinicalActionContract(def: CommandDefinition): ClinicalActionContract {
  const meta = getSecureCommandMeta(def.intent);
  const blueprintId = def.formId ?? meta.formId;
  const cicaScreenId = INTENT_CICA_SCREEN_IDS[def.intent];
  const contract: ClinicalActionContract = {
    id: def.intent,
    label: def.labelEs,
    synonyms: def.aliasesEs,
    requiresPatient: def.requiresPatient,
    requiredPermission: def.requiredPermission,
    legacyRoutePath: def.routePath,
    printable:
      meta.actionType === 'open_form' ||
      meta.family === 'print_document' ||
      meta.family === 'daily_evolution',
    aiRequired: false,
    actionType: meta.actionType,
    safetyLevel: meta.safetyLevel,
    category: meta.category,
  };
  if (blueprintId !== undefined) {
    contract.blueprintId = blueprintId;
    contract.draftType = blueprintId;
  }
  if (cicaScreenId !== undefined) {
    contract.cicaScreenId = cicaScreenId;
  }
  return contract;
}

/** Manifest derivado — no editar manualmente; extender command-registry + INTENT_CICA_SCREEN_IDS. */
export const CLINICAL_ACTION_MANIFEST: readonly ClinicalActionContract[] =
  EPIS2_COMMAND_DEFINITIONS.map(buildClinicalActionContract);

export function getClinicalActionByIntent(
  intent: ClinicalIntent,
): ClinicalActionContract | undefined {
  return CLINICAL_ACTION_MANIFEST.find((entry) => entry.id === intent);
}

export function assertClinicalActionManifestInvariants(): string[] {
  const errors: string[] = [];
  const ids = new Set<ClinicalIntent>();

  if (CLINICAL_ACTION_MANIFEST.length !== EPIS2_COMMAND_DEFINITIONS.length) {
    errors.push(
      `manifest length ${CLINICAL_ACTION_MANIFEST.length} !== definitions ${EPIS2_COMMAND_DEFINITIONS.length}`,
    );
  }

  for (const entry of CLINICAL_ACTION_MANIFEST) {
    if (ids.has(entry.id)) {
      errors.push(`intent duplicado en manifest: ${entry.id}`);
    }
    ids.add(entry.id);

    const def = EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === entry.id);
    if (!def) {
      errors.push(`manifest entry sin definition: ${entry.id}`);
      continue;
    }
    if (entry.label !== def.labelEs) {
      errors.push(`${entry.id}: label drift vs command definition`);
    }
    if (entry.legacyRoutePath !== def.routePath) {
      errors.push(`${entry.id}: legacyRoutePath drift vs command definition`);
    }
    if (entry.synonyms.length !== def.aliasesEs.length) {
      errors.push(`${entry.id}: synonyms count drift vs aliasesEs`);
    }
  }

  for (const intent of Object.keys(INTENT_CICA_SCREEN_IDS) as ClinicalIntent[]) {
    if (!ids.has(intent)) {
      errors.push(`INTENT_CICA_SCREEN_IDS.${intent} no está en command definitions`);
    }
    const screenId = INTENT_CICA_SCREEN_IDS[intent];
    if (!screenId?.trim()) {
      errors.push(`INTENT_CICA_SCREEN_IDS.${intent} vacío`);
    }
  }

  for (const intent of GOLDEN_CICA_INTENTS) {
    if (!INTENT_CICA_SCREEN_IDS[intent]) {
      errors.push(`flujo dorado sin cicaScreenId: ${intent}`);
    }
  }

  for (const def of EPIS2_COMMAND_DEFINITIONS) {
    if (!ids.has(def.intent)) {
      errors.push(`command definition ${def.intent} ausente en manifest`);
    }
  }

  return errors;
}
