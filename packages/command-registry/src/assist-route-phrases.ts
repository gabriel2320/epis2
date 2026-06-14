import type { ClinicalIntent } from './types.js';

export type AssistRoutePhraseEntry = {
  phrase: string;
  hintIntent: ClinicalIntent;
};

/** Frases long-tail que el ranker determinístico deja en aclaración; CE-3 las desbloquea con hint. */
export const ASSIST_ROUTE_PHRASE_SUITE: readonly AssistRoutePhraseEntry[] = [
  { phrase: 'dejarlo listo para irse', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'listo para irse', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'dejar listo', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'qué falta para el alta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'cerrar el episodio', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'preparar salida', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'documentos de salida', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'evolucion y epicrisis', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'resumen y laboratorio', hintIntent: 'summarize_patient' },
  { phrase: 'resumen y alta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'ayudame con el paciente', hintIntent: 'summarize_patient' },
  { phrase: 'hacer lo del alta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'ver si puede irse', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'nota y receta', hintIntent: 'create_evolution_draft' },
  { phrase: 'alta y receta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'irse de alta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'listo para el alta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'falta para el alta', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'epicrisis o evolucion', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'laboratorio o epicrisis', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'como va el paciente', hintIntent: 'summarize_patient' },
  { phrase: 'que le falta para irse', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'mandarlo a casa', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'puede irse hoy', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'documentos para salir', hintIntent: 'prepare_discharge_draft' },
  { phrase: 'echarle un vistazo al lab', hintIntent: 'open_results_inbox' },
  { phrase: 'chequear examenes', hintIntent: 'open_results_inbox' },
  { phrase: 'dejar constancia', hintIntent: 'create_evolution_draft' },
  { phrase: 'nota de guardia', hintIntent: 'create_evolution_draft' },
  { phrase: 'aplicar medicamento', hintIntent: 'record_medication_administration' },
  { phrase: 'registrar la toma', hintIntent: 'record_medication_administration' },
  { phrase: 'certificado para el trabajo', hintIntent: 'create_medical_certificate' },
  { phrase: 'control diabetes', hintIntent: 'create_evolution_draft' },
  { phrase: 'control dm2', hintIntent: 'create_evolution_draft' },
  { phrase: 'renovar receta cronica', hintIntent: 'prepare_prescription' },
  { phrase: 'solicitar laboratorio control dm2', hintIntent: 'request_laboratory' },
  { phrase: 'que dice la ia', hintIntent: 'summarize_patient' },
  { phrase: 'impresion diagnostica', hintIntent: 'register_problem' },
];

export const ASSIST_ROUTE_PHRASE_MIN_RESOLVE_RATIO = 0.7;
