import type { ClinicalIntent } from './types.js';

/**
 * Equivalencia intentId catálogo EPIS P8 → intents EPIS2 MVP.
 * Fuente: migration/candidates/epis/epis-command-synonyms-es-cl/original/
 */
export const EPIS_P8_TO_EPIS2_INTENT = {
  'nav.patient-search': 'search_patient',
  'clinical.summarize-patient': 'summarize_patient',
  'clinical.summarize-24h': 'summarize_patient',
  'clinical.evolution-note': 'create_evolution_draft',
  'clinical.discharge-summary': 'prepare_discharge_draft',
  'clinical.prescription': 'prepare_prescription',
  'clinical.lab-request': 'request_laboratory',
} as const satisfies Record<string, ClinicalIntent>;

/** Intents EPIS sin formulario MVP en EPIS2 — no importar aliases. */
export const EPIS_DEFERRED_OR_REJECTED_INTENTS = [
  'clinical.admission-note',
  'clinical.consult-request',
  'clinical.transfer-note',
  'clinical.medication-review',
  'clinical.read-context',
  'clinical.review-pending',
  'clinical.imaging-request',
  'clinical.nursing-note',
  'clinical.vitals-entry',
] as const;
