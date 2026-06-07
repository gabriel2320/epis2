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
];

export const ASSIST_ROUTE_PHRASE_MIN_RESOLVE_RATIO = 0.7;
