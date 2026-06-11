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
      /listo para irse|dejarlo listo|dejar listo|irse de alta|listo para el alta|mandarlo a casa|sacarlo de aqui|echarlo de alta|puede irse hoy|salir hoy/.test(
        q,
      ),
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
    matches: (q) =>
      /que falta para el alta|pendientes de alta|falta para el alta|que le falta|que falta para irse|documentos para salir|papeles del alta/.test(
        q,
      ),
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
      /revisar imagenes|ver imagenes|estudios de imagen|revisar tac|ver tac|echarle un vistazo.*(rx|radiografia|tac|imagen)/.test(
        q,
      ) && !/\b(solicitar|solicita|pedir|pide|orden|hemograma|laboratorio)\b/.test(q),
    message: '¿Revisar estudios de imagen en resultados o solicitar uno nuevo?',
    intentHints: ['open_results_inbox', 'request_imaging', 'summarize_patient'],
  },
  {
    id: 'review-antibiotics',
    matches: (q) =>
      /revisar antibioticos|antibioticos activos|validar antibioticos|que antibioticos lleva|antibioticoterapia/.test(
        q,
      ),
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
      /preguntar.*ia|preguntarle a la ia|ia sobre|ia por este paciente|consultar ia|que dice la ia|ayudame con la ia/.test(
        q,
      ),
    message: 'Puedo abrir el resumen clínico con asistencia IA sobre el paciente activo.',
    intentHints: ['summarize_patient', 'open_results_inbox', 'prepare_discharge_draft'],
  },
  {
    id: 'summarize-case',
    matches: (q) =>
      /resumir caso|resumir el caso|resumen del caso|como va el paciente|como esta el paciente|como anda|que tal el paciente|panorama clinico|sintesis del caso/.test(
        q,
      ),
    message: '¿Resumen clínico general o enfoque en alta/pendientes?',
    intentHints: ['summarize_patient', 'prepare_discharge_draft', 'open_results_inbox'],
  },
  {
    id: 'open-chart',
    matches: (q) =>
      /abrir ficha|ver ficha|ir a ficha|mostrar ficha del paciente/.test(q) &&
      !/\bficha\s+(de|del)\s+\w/.test(q),
    message: '¿Buscar paciente o abrir la ficha del paciente activo?',
    intentHints: ['open_patient_chart', 'search_patient', 'summarize_patient'],
  },
  {
    id: 'print-rx',
    matches: (q) =>
      /imprimir receta|imprimir prescripcion|armar la receta|hacer la receta|dejar la receta lista/.test(q),
    message: 'La receta se prepara como borrador antes de imprimir.',
    intentHints: ['prepare_prescription', 'reconcile_medications', 'summarize_patient'],
  },
  {
    id: 'print-cert',
    matches: (q) =>
      /imprimir certificado|imprimir certificado medico|certificado para el trabajo|certificado de reposo/.test(
        q,
      ),
    message: 'Puedo abrir el formulario de certificado médico.',
    intentHints: ['create_medical_certificate', 'prepare_prescription', 'summarize_patient'],
  },
  {
    id: 'check-labs-colloquial',
    matches: (q) =>
      /como va el laboratorio|echarle un vistazo al lab|chequear examenes|ver los examenes|que salio en los examenes|resultados de ayer/.test(
        q,
      ),
    message: '¿Abrir bandeja de resultados o solicitar laboratorio nuevo?',
    intentHints: ['open_results_inbox', 'request_laboratory', 'summarize_patient'],
  },
  {
    id: 'write-note-colloquial',
    matches: (q) =>
      /anotar evolucion|dejar constancia|apuntar en la ficha|escribir lo de hoy|dejar la nota|nota de guardia/.test(
        q,
      ),
    message: '¿Nota médica de evolución o nota de enfermería?',
    intentHints: ['create_evolution_draft', 'create_nursing_note', 'summarize_patient'],
  },
  {
    id: 'nursing-med-admin',
    matches: (q) =>
      /aplicar medicamento|administrar la dosis|dar la inyeccion|registrar la toma|pasar la medicacion|mar de hoy/.test(
        q,
      ),
    message: '¿Registrar administración en MAR o revisar medicamentos?',
    intentHints: [
      'record_medication_administration',
      'reconcile_medications',
      'prepare_pharmacy_review',
    ],
  },
  {
    id: 'referral-colloquial',
    matches: (q) =>
      /derivar a|mandar a cardiologia|consultar con especialista|pedir opinion de|interconsulta urgente|ver especialista/.test(
        q,
      ),
    message: '¿Crear interconsulta o revisar respuestas pendientes?',
    intentHints: ['request_referral', 'respond_referral', 'summarize_patient'],
  },
  {
    id: 'order-imaging-colloquial',
    matches: (q) =>
      /pedir una rx|mandar a tac|solicitar radiografia|orden de imagen|pedir ecografia|solicitar resonancia/.test(
        q,
      ),
    message: '¿Solicitar estudio de imagen o revisar resultados previos?',
    intentHints: ['request_imaging', 'open_results_inbox', 'summarize_patient'],
  },
  {
    id: 'pharmacy-colloquial',
    matches: (q) =>
      /validar en farmacia|que dice farmacia|revision farmaceutica|chequear recetario|validar medicacion/.test(
        q,
      ),
    message: '¿Validación farmacéutica, conciliación o MAR?',
    intentHints: [
      'prepare_pharmacy_review',
      'reconcile_medications',
      'record_medication_administration',
    ],
  },
  {
    id: 'allergy-colloquial',
    matches: (q) =>
      /registrar alergia|alergico a|reaccion al|antecedente alergico|marcar alergia/.test(q),
    message: 'Puedo abrir el registro de alergias del paciente.',
    intentHints: ['register_allergy', 'summarize_patient', 'reconcile_medications'],
  },
  {
    id: 'problem-colloquial',
    matches: (q) =>
      /impresion diagnostica|diagnostico principal|problema activo|registrar diagnostico|anotar problema/.test(
        q,
      ),
    message: '¿Registrar problema clínico o revisar resumen del caso?',
    intentHints: ['register_problem', 'summarize_patient', 'create_evolution_draft'],
  },
];

export function matchColloquialRule(normalized: string): ColloquialRule | undefined {
  return COLLOQUIAL_RULES.find((rule) => rule.matches(normalized));
}
