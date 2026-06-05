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
      'resumen del paciente',
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
      'evoluciona',
      'evolucion',
      'nota de evolucion',
      'escribe evolucion',
      'crear evolucion',
      'evolucion medica',
      'actualizar evolucion',
      'redactar evolucion',
      'evolucionar',
    ],
    routePath: INTENT_ROUTE_PATHS.create_evolution_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 50,
    match: (q) =>
      /evolucion|evoluciona|evolucionar|nota\s+de\s+evolucion|evolucion\s+diaria/.test(q),
  },
  {
    intent: 'prepare_discharge_draft',
    labelEs: 'Epicrisis',
    aliasesEs: [
      'haz epicrisis',
      'epicrisis',
      'alta medica',
      'alta hospitalaria',
      'egreso hospitalario',
      'egreso',
      'resumen de alta',
      'preparar epicrisis',
      'nota de egreso',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_discharge_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 35,
    match: (q) =>
      /epicrisis|alta\s+(medica|hospitalaria)|resumen\s+de\s+alta|egreso|discharge|nota\s+de\s+egreso/.test(q),
  },
  {
    intent: 'prepare_prescription',
    labelEs: 'Receta médica',
    aliasesEs: [
      'preparar receta médica',
      'preparar receta',
      'preparar prescripción',
      'prepara receta',
      'receta médica',
      'receta',
      'reseta',
      'prescripción médica',
      'prescribe',
      'emitir receta',
      'ordenar medicamento',
      'recetar paracetamol',
      'prescribe amoxicilina',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_prescription,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 70,
    match: (q) =>
      /receta|prescripcion|prescripción|prescribe|recetar|medicamento|preparar\s+receta|preparar\s+prescripcion/.test(
        q,
      ),
  },
  {
    intent: 'request_laboratory',
    labelEs: 'Solicitud de laboratorio',
    aliasesEs: [
      'solicitar laboratorio',
      'solicita laboratorio',
      'pedir laboratorio',
      'pide laboratorio',
      'orden de laboratorio',
      'solicitud de analitica',
      'estudios de laboratorio',
      'hemograma completo',
      'hemograma',
      'hb ht',
      'solicitar lab',
    ],
    routePath: INTENT_ROUTE_PATHS.request_laboratory,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 75,
    match: (q) =>
      /laboratorio|analitica|hemograma|bioquimica|bioquímica|ordena\s+lab|solicita\s+lab/.test(q) ||
      (/\b(pide|pedir|solicitar)\b/.test(q) &&
        /hemograma|analitica|laboratorio|lab\b|hb\s+ht/.test(q)) ||
      (/lab\b/.test(q) && !/laboral/.test(q)),
  },
  {
    intent: 'request_referral',
    labelEs: 'Interconsulta',
    aliasesEs: [
      'solicitar interconsulta',
      'interconsulta',
      'derivar a especialidad',
      'pedir interconsulta',
    ],
    routePath: INTENT_ROUTE_PATHS.request_referral,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 76,
    match: (q) => /interconsulta|derivar\s+a\s+especialidad/.test(q),
  },
  {
    intent: 'request_imaging',
    labelEs: 'Imagenología',
    aliasesEs: [
      'solicitar imagen',
      'solicitar imagenologia',
      'pedir tac',
      'pedir radiografia',
      'estudio de imagen',
      'orden de imagen',
    ],
    routePath: INTENT_ROUTE_PATHS.request_imaging,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 77,
    match: (q) =>
      /imagenologia|imagenología|radiografia|radiografía|\btac\b|\brm\b|tomografia|ecografia/.test(
        q,
      ),
  },
  {
    intent: 'create_nursing_note',
    labelEs: 'Nota de enfermería',
    aliasesEs: [
      'nota de enfermeria',
      'nota enfermeria',
      'registrar cuidados',
      'signos vitales',
    ],
    routePath: INTENT_ROUTE_PATHS.create_nursing_note,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 55,
    match: (q) => /nota\s+de\s+enfermer|enfermeria|signos\s+vitales|registrar\s+cuidados/.test(q),
  },
  {
    intent: 'record_medication_administration',
    labelEs: 'Administración MAR',
    aliasesEs: [
      'administrar medicamento',
      'registrar mar',
      'mar',
      'dar medicamento',
      'administracion medicamento',
    ],
    routePath: INTENT_ROUTE_PATHS.record_medication_administration,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 72,
    match: (q) =>
      /\bmar\b/.test(q) ||
      /administrar\s+medicamento|administracion\s+medicamento|dar\s+medicamento|registrar\s+mar/.test(
        q,
      ),
  },
  {
    intent: 'prepare_pharmacy_review',
    labelEs: 'Validación farmacéutica',
    aliasesEs: [
      'validacion farmaceutica',
      'revisar prescripcion',
      'intervencion farmacia',
      'farmacia clinica',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_pharmacy_review,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 68,
    match: (q) =>
      /validacion\s+farmaceutica|farmacia\s+clinica|intervencion\s+farmacia|revisar\s+prescripcion/.test(
        q,
      ),
  },
  {
    intent: 'open_dashboard_quality',
    labelEs: 'Tablero calidad',
    aliasesEs: [
      'tablero calidad',
      'tablero de calidad',
      'auditoria del sistema',
      'ver auditoria',
      'panel de calidad',
    ],
    routePath: INTENT_ROUTE_PATHS.open_dashboard_quality,
    requiredPermission: 'audit.read',
    requiresPatient: false,
    priority: 81,
    match: (q) =>
      /tablero\s+(de\s+)?calidad|panel\s+de\s+calidad|auditoria\s+del\s+sistema|ver\s+auditoria/.test(
        q,
      ),
  },
  {
    intent: 'open_dashboard_work',
    labelEs: 'Mi trabajo',
    aliasesEs: ['ver mi trabajo', 'mi trabajo', 'mis tareas', 'mi bandeja'],
    routePath: INTENT_ROUTE_PATHS.open_dashboard_work,
    requiredPermission: 'dashboard.read',
    requiresPatient: false,
    priority: 85,
    match: (q) =>
      /^ver\s+mi\s+trabajo/.test(q) ||
      /mi\s+trabajo|mis\s+tareas|mi\s+bandeja/.test(q),
  },
  {
    intent: 'open_dashboard_patient',
    labelEs: 'Tablero del paciente',
    aliasesEs: ['ver tablero del paciente', 'tablero del paciente', 'tablero paciente'],
    routePath: INTENT_ROUTE_PATHS.open_dashboard_patient,
    requiredPermission: 'dashboard.read',
    requiresPatient: true,
    priority: 84,
    match: (q) => /tablero\s+(del\s+)?paciente/.test(q),
  },
  {
    intent: 'open_dashboard_service',
    labelEs: 'Tablero del servicio',
    aliasesEs: ['ver el servicio', 'tablero del servicio', 'tablero servicio'],
    routePath: INTENT_ROUTE_PATHS.open_dashboard_service,
    requiredPermission: 'dashboard.read',
    requiresPatient: false,
    priority: 83,
    match: (q) => /tablero\s+(del\s+)?servicio|ver\s+el\s+servicio/.test(q),
  },
  {
    intent: 'open_dashboard',
    labelEs: 'Modo tablero',
    aliasesEs: [
      'abre el tablero',
      'modo dashboard',
      'modo tablero',
      'ver indicadores',
      'abrir tablero',
      'ir al tablero',
    ],
    routePath: INTENT_ROUTE_PATHS.open_dashboard,
    requiredPermission: 'dashboard.read',
    requiresPatient: false,
    priority: 82,
    match: (q) =>
      /modo\s+(tablero|dashboard)|abre\s+el\s+tablero|abrir\s+tablero|ir\s+al\s+tablero/.test(q) ||
      (/\btablero\b/.test(q) &&
        !/paciente|servicio|mi\s+trabajo/.test(q)) ||
      /\bver\s+indicadores\b/.test(q),
  },
];

/** Frases que activan más de un intent con la misma prioridad — deben quedar ambiguas. */
export const AMBIGUOUS_PHRASES = [
  'resumen y laboratorio',
  'evolucion y epicrisis',
  'paciente resumen laboratorio',
] as const;
