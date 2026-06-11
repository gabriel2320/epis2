import type { CommandActiveContext, CommandDefinition } from './types.js';
import { paperChartIntentBoost } from './paper-commands.js';
import { paperPlannerIntentBoost } from './paper-planner-commands.js';

const DRAFT_CONTEXT_INTENTS = new Set([
  'create_evolution_draft',
  'prepare_discharge_draft',
  'prepare_prescription',
  'create_nursing_note',
  'create_medical_certificate',
]);

const ALERT_CONTEXT_INTENTS = new Set([
  'open_results_inbox',
  'reconcile_medications',
  'prepare_pharmacy_review',
  'summarize_patient',
  'record_medication_administration',
]);

/** Boosts determinísticos según borradores/alertas activas (CE-1). */
export function applyContextScoreBoost(
  def: CommandDefinition,
  context: CommandActiveContext | undefined,
  hasPatient: boolean,
): number {
  if (!context) return 0;

  let boost = 0;
  const drafts = context.pendingDraftCount ?? 0;
  const alerts = context.activeAlertCount ?? 0;

  if (drafts > 0 && DRAFT_CONTEXT_INTENTS.has(def.intent)) {
    boost = Math.max(boost, 6 + Math.min(drafts, 4));
  }

  if (alerts > 0 && ALERT_CONTEXT_INTENTS.has(def.intent)) {
    boost = Math.max(boost, 8 + Math.min(alerts, 4));
  }

  if (hasPatient && def.intent === 'open_patient_chart') {
    boost = Math.max(boost, 18);
  }

  if (context.workspace === 'patient_chart' && def.intent === 'summarize_patient') {
    boost = Math.max(boost, 4);
  }

  if (context.chartMode === 'paper') {
    boost = Math.max(boost, paperChartIntentBoost(def.intent, context.chartMode));
    boost = Math.max(boost, paperPlannerIntentBoost(def.intent, context));
  }

  return boost;
}

export function contextFallbackIntents(
  context: CommandActiveContext | undefined,
  hasPatient: boolean,
): readonly import('./types.js').ClinicalIntent[] {
  const intents: import('./types.js').ClinicalIntent[] = [];

  if (hasPatient && (context?.activeAlertCount ?? 0) > 0) {
    intents.push('open_results_inbox', 'reconcile_medications', 'prepare_pharmacy_review');
  }

  if (hasPatient && (context?.pendingDraftCount ?? 0) > 0) {
    intents.push('create_evolution_draft', 'prepare_discharge_draft', 'prepare_prescription');
  }

  if (hasPatient) {
    intents.push('open_patient_chart');
  }

  return intents;
}
