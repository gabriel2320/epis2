/** Mapa tramo cerrado → blueprints assist Ollama (Semana 3). */
export const ACTIVE_TRAMO = 'K';

/** @type {Record<string, readonly string[]>} */
export const TRAMO_ASSIST_BLUEPRINTS = {
  B: ['outpatient_visit'],
  C: ['admission_note', 'nursing_note'],
  D: ['evolution_note', 'nursing_note'],
  E: ['evolution_note'],
  F: ['outpatient_visit', 'evolution_note'],
  G: ['nursing_note', 'medication_administration'],
  H: ['nursing_note', 'evolution_note'],
  I: ['outpatient_visit', 'referral_report', 'evolution_note'],
  J: ['pharmacy_validation', 'medication_reconciliation', 'prescription'],
  K: ['evolution_note', 'nursing_note', 'discharge_summary'],
};

/**
 * @param {string} tramo
 * @returns {string[] | undefined}
 */
export function blueprintsForTramo(tramo) {
  return TRAMO_ASSIST_BLUEPRINTS[tramo.toUpperCase()];
}
