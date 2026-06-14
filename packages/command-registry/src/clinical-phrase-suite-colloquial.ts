import type {
  ClinicalPhraseExpectation,
  ClinicalPhraseSuiteEntry,
} from './clinical-phrase-suite-50.js';

/** Frases coloquiales ampliadas — complemento CE-0 (MF-CM-07). */
export const CLINICAL_PHRASE_SUITE_COLLOQUIAL: readonly ClinicalPhraseSuiteEntry[] = [
  {
    phrase: 'como va el paciente',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'que le falta para irse',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'mandarlo a casa',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'como va el laboratorio',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'chequear examenes',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'anotar evolucion',
    expectation: { kind: 'resolved', intent: 'create_evolution_draft', requiresPatient: true },
  },
  {
    phrase: 'dejar constancia en la ficha',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'aplicar medicamento',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'registrar la toma',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'derivar a cardiologia',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'mandar a tac',
    expectation: { kind: 'needs_patient', intent: 'request_imaging' },
  },
  {
    phrase: 'pedir una rx',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'validar en farmacia',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'registrar alergia a penicilina',
    expectation: { kind: 'needs_patient', intent: 'register_allergy' },
  },
  {
    phrase: 'impresion diagnostica principal',
    expectation: { kind: 'resolved', intent: 'register_problem', requiresPatient: true },
  },
  {
    phrase: 'armar la receta',
    expectation: { kind: 'resolved', intent: 'prepare_prescription', requiresPatient: true },
  },
  {
    phrase: 'certificado para el trabajo',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'que dice la ia',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'panorama clinico',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'puede irse hoy',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'documentos para salir',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'nota de guardia',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'resultados de ayer',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'solicitar resonancia',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
  {
    phrase: 'marcar alergia',
    expectation: { kind: 'needs_clarification', minCandidates: 3 },
  },
];

export const CLINICAL_PHRASE_SUITE_COLLOQUIAL_MIN_USEFUL_RATIO = 0.9;

export type { ClinicalPhraseExpectation, ClinicalPhraseSuiteEntry };
