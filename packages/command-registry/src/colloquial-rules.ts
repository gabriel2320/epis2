import type { ClinicalIntent } from './types.js';

export type ColloquialRule = {
  id: string;
  matches: (normalized: string) => boolean;
  message: string;
  intentHints: readonly ClinicalIntent[];
};

/** Frases coloquiales → candidatos guiados (sin IA). */
export const COLLOQUIAL_RULES: readonly ColloquialRule[] = [
  {
    id: 'ready-to-leave',
    matches: (q) =>
      /listo para irse|dejarlo listo|dejar listo|irse de alta|listo para el alta/.test(q),
    message:
      'Parece que quieres preparar el alta. Puedo crear epicrisis, revisar pendientes o preparar indicaciones.',
    intentHints: [
      'prepare_discharge_draft',
      'summarize_patient',
      'open_results_inbox',
      'prepare_prescription',
    ],
  },
  {
    id: 'discharge-pending',
    matches: (q) => /que falta para el alta|pendientes de alta|falta para el alta/.test(q),
    message: 'Para el alta puedo revisar pendientes, resumir el caso o preparar la epicrisis.',
    intentHints: [
      'prepare_discharge_draft',
      'summarize_patient',
      'open_results_inbox',
      'reconcile_medications',
    ],
  },
  {
    id: 'review-imaging',
    matches: (q) =>
      /revisar imagenes|ver imagenes|estudios de imagen|revisar tac|ver tac/.test(q) &&
      !/\b(solicitar|solicita|pedir|pide|orden|hemograma|laboratorio)\b/.test(q),
    message: '¿Revisar estudios de imagen en resultados o solicitar uno nuevo?',
    intentHints: ['open_results_inbox', 'request_imaging', 'summarize_patient'],
  },
  {
    id: 'review-antibiotics',
    matches: (q) => /revisar antibioticos|antibioticos activos|validar antibioticos/.test(q),
    message: '¿Revisión farmacéutica, conciliación o MAR?',
    intentHints: [
      'prepare_pharmacy_review',
      'reconcile_medications',
      'record_medication_administration',
    ],
  },
  {
    id: 'ask-ai',
    matches: (q) =>
      /preguntar.*ia|preguntarle a la ia|ia sobre|ia por este paciente|consultar ia/.test(q),
    message: 'Puedo abrir el resumen clínico con asistencia IA sobre el paciente activo.',
    intentHints: ['summarize_patient', 'open_results_inbox', 'prepare_discharge_draft'],
  },
  {
    id: 'summarize-case',
    matches: (q) => /resumir caso|resumir el caso|resumen del caso/.test(q),
    message: '¿Resumen clínico general o enfoque en alta/pendientes?',
    intentHints: ['summarize_patient', 'prepare_discharge_draft', 'open_results_inbox'],
  },
  {
    id: 'open-chart',
    matches: (q) =>
      /abrir ficha|ver ficha|ir a ficha/.test(q) && !/\bficha\s+(de|del)\s+\w/.test(q),
    message: '¿Buscar paciente o abrir la ficha del paciente activo?',
    intentHints: ['open_patient_chart', 'search_patient', 'summarize_patient'],
  },
  {
    id: 'print-rx',
    matches: (q) => /imprimir receta|imprimir prescripcion/.test(q),
    message: 'La receta se prepara como borrador antes de imprimir.',
    intentHints: ['prepare_prescription', 'reconcile_medications', 'summarize_patient'],
  },
  {
    id: 'print-cert',
    matches: (q) => /imprimir certificado|imprimir certificado medico/.test(q),
    message: 'Puedo abrir el formulario de certificado médico.',
    intentHints: ['create_medical_certificate', 'prepare_prescription', 'summarize_patient'],
  },
];

export function matchColloquialRule(normalized: string): ColloquialRule | undefined {
  return COLLOQUIAL_RULES.find((rule) => rule.matches(normalized));
}
