import { INTENT_ROUTE_PATHS } from './routes.js';
import type { CommandDefinition } from './types.js';

export const EPIS2_COMMAND_DEFINITIONS: readonly CommandDefinition[] = [
  {
    intent: 'search_patient',
    labelEs: 'Buscar paciente',
    aliasesEs: [
      'buscar paciente',
      'busca paciente',
      'encontrar paciente',
      'localizar paciente',
      'busqueda de paciente',
      'abrir busqueda',
      'ir a buscar paciente',
    ],
    routePath: INTENT_ROUTE_PATHS.search_patient,
    requiredPermission: 'command.execute',
    requiresPatient: false,
    priority: 10,
    match: (q) =>
      /abrir\s+busqueda/.test(q) ||
      /ir\s+a\s+buscar/.test(q) ||
      (/paciente/.test(q) &&
        /(buscar|busca|encontrar|localizar|busqueda)/.test(q) &&
        !/resumen|resumir|resume|evolucion|epicrisis|receta|prescripcion|laboratorio|lab\b|analitica/.test(
          q,
        )),
  },
  {
    intent: 'summarize_patient',
    labelEs: 'Resumen clínico',
    aliasesEs: [
      'resume al paciente',
      'resumen clinico',
      'resumir paciente',
      'sintesis clinica',
      'ultimas 24 horas',
      'ver resumen',
      'mostrar resumen',
      'historia resumida',
    ],
    routePath: INTENT_ROUTE_PATHS.summarize_patient,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 45,
    match: (q) =>
      (/resumen|resumir|resume|sintesis|historia/.test(q) &&
        !/laboratorio|lab\b|analitica|epicrisis|evolucion|receta|prescripcion|alta|egreso|nota\s+de\s+egreso/.test(
          q,
        )) ||
      /ultimas\s*24/.test(q),
  },
  {
    intent: 'create_evolution_draft',
    labelEs: 'Evolución médica',
    aliasesEs: [
      'evoluciona al paciente',
      'nota de evolucion',
      'escribe evolucion',
      'crear evolucion',
      'evolucion medica',
      'actualizar evolucion',
      'redactar evolucion',
    ],
    routePath: INTENT_ROUTE_PATHS.create_evolution_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 50,
    match: (q) => /evolucion|evoluciona|evolucionar|nota\s+de\s+evolucion/.test(q),
  },
  {
    intent: 'prepare_discharge_draft',
    labelEs: 'Epicrisis',
    aliasesEs: [
      'haz epicrisis',
      'epicrisis',
      'alta medica',
      'egreso hospitalario',
      'resumen de alta',
      'preparar epicrisis',
      'nota de egreso',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_discharge_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 35,
    match: (q) =>
      /epicrisis|alta\s+medica|resumen\s+de\s+alta|egreso|discharge|nota\s+de\s+egreso/.test(q),
  },
  {
    intent: 'prepare_prescription',
    labelEs: 'Receta médica',
    aliasesEs: [
      'prepara receta',
      'receta medica',
      'prescribe amoxicilina',
      'prescripcion medica',
      'emitir receta',
      'ordenar medicamento',
      'recetar paracetamol',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_prescription,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 70,
    match: (q) => /receta|prescripcion|prescribe|recetar|medicamento/.test(q),
  },
  {
    intent: 'request_laboratory',
    labelEs: 'Solicitud de laboratorio',
    aliasesEs: [
      'solicita laboratorio',
      'pedir laboratorio',
      'orden de laboratorio',
      'solicitud de analitica',
      'estudios de laboratorio',
      'hemograma completo',
      'solicitar lab',
    ],
    routePath: INTENT_ROUTE_PATHS.request_laboratory,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 75,
    match: (q) =>
      /laboratorio|analitica|hemograma|bioquimica|bioquímica|ordena\s+lab|solicita\s+lab/.test(q) ||
      (/lab\b/.test(q) && !/laboral/.test(q)),
  },
];

/** Frases que activan más de un intent con la misma prioridad — deben quedar ambiguas. */
export const AMBIGUOUS_PHRASES = [
  'resumen y laboratorio',
  'evolucion y epicrisis',
  'paciente resumen laboratorio',
] as const;
