import type { ClinicalIntent } from './types.js';

export type CommandIntentTop10Entry = {
  intent: ClinicalIntent;
  phrases: readonly string[];
};

/** Top-10 intents clínicos — al menos una frase resuelve por intent (MF-CM-07). */
export const COMMAND_INTENT_TOP10: readonly CommandIntentTop10Entry[] = [
  {
    intent: 'create_evolution_draft',
    phrases: ['hacer evolución', 'evolucionar paciente', 'nota de evolucion'],
  },
  {
    intent: 'summarize_patient',
    phrases: ['resumir caso', 'resume al paciente', 'resumir el caso'],
  },
  {
    intent: 'open_results_inbox',
    phrases: ['ver exámenes de hoy', 'bandeja de resultados', 'revisar hemograma'],
  },
  {
    intent: 'prepare_discharge_draft',
    phrases: ['preparar alta', 'hacer epicrisis', 'epicrisis'],
  },
  {
    intent: 'search_patient',
    phrases: ['buscar paciente', 'buscar paciente Juan', 'encontrar paciente'],
  },
  {
    intent: 'request_laboratory',
    phrases: ['solicitar hemograma', 'orden de laboratorio', 'pedir analitica'],
  },
  {
    intent: 'prepare_prescription',
    phrases: ['preparar receta', 'emitir receta', 'prescribe paracetamol 500 mg'],
  },
  {
    intent: 'reconcile_medications',
    phrases: ['revisar medicamentos', 'conciliacion medicamentosa', 'conciliar medicamentos'],
  },
  {
    intent: 'request_imaging',
    phrases: ['pedir TAC de tórax', 'solicitar tac', 'pedir tac'],
  },
  {
    intent: 'prepare_pharmacy_review',
    phrases: ['revisar antibióticos', 'validacion farmaceutica', 'revision farmaceutica'],
  },
];

export const COMMAND_INTENT_TOP10_MIN_RESOLVE_RATIO = 0.9;
