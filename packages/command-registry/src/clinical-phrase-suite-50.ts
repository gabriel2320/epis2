import type { ClinicalIntent } from './types.js';

export type ClinicalPhraseExpectation =
  | { kind: 'resolved'; intent: ClinicalIntent; requiresPatient?: boolean }
  | { kind: 'needs_patient'; intent: ClinicalIntent }
  | { kind: 'needs_clarification'; minCandidates?: number }
  | { kind: 'useful' };

export type ClinicalPhraseSuiteEntry = {
  phrase: string;
  expectation: ClinicalPhraseExpectation;
};

/** 50 frases clínicas reales — gate CE-0 (≥90% respuesta útil). */
export const CLINICAL_PHRASE_SUITE_50: readonly ClinicalPhraseSuiteEntry[] = [
  {
    phrase: 'hacer evolución',
    expectation: { kind: 'needs_patient', intent: 'create_evolution_draft' },
  },
  {
    phrase: 'evolucionar paciente',
    expectation: { kind: 'needs_patient', intent: 'create_evolution_draft' },
  },
  {
    phrase: 'crear nota diaria',
    expectation: { kind: 'needs_patient', intent: 'create_evolution_draft' },
  },
  {
    phrase: 'escribir SOAP',
    expectation: { kind: 'needs_patient', intent: 'create_evolution_draft' },
  },
  {
    phrase: 'ver exámenes de hoy',
    expectation: { kind: 'needs_patient', intent: 'open_results_inbox' },
  },
  {
    phrase: 'cómo está el laboratorio',
    expectation: { kind: 'resolved', intent: 'open_results_inbox', requiresPatient: true },
  },
  {
    phrase: 'revisar hemograma',
    expectation: { kind: 'resolved', intent: 'open_results_inbox', requiresPatient: true },
  },
  {
    phrase: 'solicitar hemograma',
    expectation: { kind: 'needs_patient', intent: 'request_laboratory' },
  },
  {
    phrase: 'pedir TAC de tórax',
    expectation: { kind: 'needs_patient', intent: 'request_imaging' },
  },
  {
    phrase: 'revisar imágenes',
    expectation: { kind: 'resolved', intent: 'open_results_inbox', requiresPatient: true },
  },
  {
    phrase: 'crear interconsulta a cardiología',
    expectation: { kind: 'needs_patient', intent: 'request_referral' },
  },
  {
    phrase: 'revisar medicamentos',
    expectation: { kind: 'needs_patient', intent: 'reconcile_medications' },
  },
  {
    phrase: 'ver MAR',
    expectation: { kind: 'needs_patient', intent: 'record_medication_administration' },
  },
  {
    phrase: 'revisar antibióticos',
    expectation: { kind: 'resolved', intent: 'prepare_pharmacy_review', requiresPatient: true },
  },
  {
    phrase: 'preparar alta',
    expectation: { kind: 'needs_patient', intent: 'prepare_discharge_draft' },
  },
  {
    phrase: 'hacer epicrisis',
    expectation: { kind: 'needs_patient', intent: 'prepare_discharge_draft' },
  },
  {
    phrase: 'dejarlo listo para irse',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'revisar pendientes de alta',
    expectation: { kind: 'resolved', intent: 'prepare_discharge_draft', requiresPatient: true },
  },
  {
    phrase: 'imprimir receta',
    expectation: { kind: 'resolved', intent: 'prepare_prescription', requiresPatient: true },
  },
  {
    phrase: 'imprimir certificado',
    expectation: { kind: 'resolved', intent: 'create_medical_certificate', requiresPatient: true },
  },
  {
    phrase: 'resumir caso',
    expectation: { kind: 'resolved', intent: 'summarize_patient', requiresPatient: true },
  },
  {
    phrase: 'preguntarle a la IA por este paciente',
    expectation: { kind: 'resolved', intent: 'summarize_patient', requiresPatient: true },
  },
  { phrase: 'buscar paciente Juan', expectation: { kind: 'resolved', intent: 'search_patient' } },
  { phrase: 'abrir ficha de Juan', expectation: { kind: 'resolved', intent: 'search_patient' } },
  {
    phrase: 'qué falta para el alta',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'evoluciona al paciente',
    expectation: { kind: 'resolved', intent: 'create_evolution_draft', requiresPatient: true },
  },
  {
    phrase: 'bandeja de resultados',
    expectation: { kind: 'resolved', intent: 'open_results_inbox', requiresPatient: true },
  },
  {
    phrase: 'solicitar laboratorio',
    expectation: { kind: 'resolved', intent: 'request_laboratory', requiresPatient: true },
  },
  {
    phrase: 'pedir tac',
    expectation: { kind: 'resolved', intent: 'request_imaging', requiresPatient: true },
  },
  {
    phrase: 'hacer interconsulta',
    expectation: { kind: 'resolved', intent: 'request_referral', requiresPatient: true },
  },
  {
    phrase: 'conciliacion medicamentosa',
    expectation: { kind: 'resolved', intent: 'reconcile_medications', requiresPatient: true },
  },
  {
    phrase: 'validacion farmaceutica',
    expectation: { kind: 'resolved', intent: 'prepare_pharmacy_review', requiresPatient: true },
  },
  {
    phrase: 'preparar receta',
    expectation: { kind: 'resolved', intent: 'prepare_prescription', requiresPatient: true },
  },
  {
    phrase: 'resume al paciente',
    expectation: { kind: 'resolved', intent: 'summarize_patient', requiresPatient: true },
  },
  {
    phrase: 'epicrisis',
    expectation: { kind: 'resolved', intent: 'prepare_discharge_draft', requiresPatient: true },
  },
  {
    phrase: 'registrar mar',
    expectation: {
      kind: 'resolved',
      intent: 'record_medication_administration',
      requiresPatient: true,
    },
  },
  {
    phrase: 'emitir certificado',
    expectation: { kind: 'resolved', intent: 'create_medical_certificate', requiresPatient: true },
  },
  { phrase: 'buscar paciente', expectation: { kind: 'resolved', intent: 'search_patient' } },
  { phrase: 'ver mi trabajo', expectation: { kind: 'resolved', intent: 'open_dashboard_work' } },
  {
    phrase: 'xyz comando inventado',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'evolucion y epicrisis',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'resumen y laboratorio',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'nota de evolucion',
    expectation: { kind: 'needs_patient', intent: 'create_evolution_draft' },
  },
  {
    phrase: 'orden de laboratorio',
    expectation: { kind: 'needs_patient', intent: 'request_laboratory' },
  },
  {
    phrase: 'estudio de imagen',
    expectation: { kind: 'needs_patient', intent: 'request_imaging' },
  },
  {
    phrase: 'certificado medico',
    expectation: { kind: 'needs_patient', intent: 'create_medical_certificate' },
  },
  {
    phrase: 'ver resultados',
    expectation: { kind: 'needs_patient', intent: 'open_results_inbox' },
  },
  {
    phrase: 'receta medica',
    expectation: { kind: 'needs_patient', intent: 'prepare_prescription' },
  },
  { phrase: 'interconsulta', expectation: { kind: 'needs_patient', intent: 'request_referral' } },
  { phrase: 'abrir ficha', expectation: { kind: 'needs_patient', intent: 'open_patient_chart' } },
  { phrase: 'listo para irse', expectation: { kind: 'needs_clarification', minCandidates: 3 } },
];

export const CLINICAL_PHRASE_SUITE_MIN_USEFUL_RATIO = 0.9;
