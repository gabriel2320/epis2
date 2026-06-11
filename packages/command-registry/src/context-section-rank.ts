import type { ClinicalIntent, CommandDefinition } from './types.js';

/** 17 secciones nav ficha tradicional (canon §6). */
export const TRADITIONAL_SECTION_NAV_IDS = [
  'navSummary',
  'navAdmin',
  'navAnamnesis',
  'navAntecedents',
  'navAllergies',
  'navPhysicalExam',
  'navDiagnoses',
  'navOrders',
  'navMeds',
  'navEvolution',
  'navLabs',
  'navImaging',
  'navConsults',
  'navDocuments',
  'navEpicrisis',
  'navProcedures',
  'navAudit',
] as const;

export type TraditionalSectionNavId = (typeof TRADITIONAL_SECTION_NAV_IDS)[number];

const SECTION_INTENT_BOOSTS: Partial<Record<TraditionalSectionNavId, readonly ClinicalIntent[]>> = {
  navOrders: ['request_laboratory', 'request_imaging', 'request_procedure', 'request_referral'],
  navMeds: [
    'reconcile_medications',
    'prepare_pharmacy_review',
    'prepare_prescription',
    'record_medication_administration',
  ],
  navLabs: ['open_results_inbox', 'request_laboratory'],
  navEvolution: ['create_evolution_draft', 'create_nursing_note'],
  navDiagnoses: ['register_problem'],
  navAllergies: ['register_allergy'],
  navEpicrisis: ['prepare_discharge_draft'],
  navConsults: ['request_referral', 'respond_referral'],
  navImaging: ['request_imaging'],
  navProcedures: ['request_procedure'],
};

const BLUEPRINT_INTENT_BOOSTS: Partial<Record<string, readonly ClinicalIntent[]>> = {
  evolution_note: ['create_evolution_draft'],
  lab_request: ['request_laboratory'],
  medication_reconciliation: ['reconcile_medications'],
  pharmacy_validation: ['prepare_pharmacy_review'],
  prescription: ['prepare_prescription'],
  discharge_summary: ['prepare_discharge_draft'],
};

const SECTION_BOOST = 5;
const BLUEPRINT_BOOST = 4;

export function isTraditionalSectionNavId(value: string): value is TraditionalSectionNavId {
  return (TRADITIONAL_SECTION_NAV_IDS as readonly string[]).includes(value);
}

/** Boost determinístico según sección activa en ficha tradicional (MF-CM-04). */
export function traditionalSectionIntentBoost(
  def: CommandDefinition,
  traditionalSection: TraditionalSectionNavId | undefined,
): number {
  if (!traditionalSection) return 0;
  const intents = SECTION_INTENT_BOOSTS[traditionalSection];
  if (!intents?.includes(def.intent)) return 0;
  return SECTION_BOOST;
}

/** Boost cuando hay blueprint de borrador activo en contexto (MF-CM-04). */
export function assistBlueprintIntentBoost(
  def: CommandDefinition,
  assistBlueprintId: string | undefined,
): number {
  if (!assistBlueprintId) return 0;
  const intents = BLUEPRINT_INTENT_BOOSTS[assistBlueprintId];
  if (!intents?.includes(def.intent)) return 0;
  return BLUEPRINT_BOOST;
}
