import { INTENT_SECURE_METADATA } from './intent-metadata.js';
import { PAPER_CHART_COMMAND_DEFINITIONS } from './paper-commands.js';
import { PAPER_PLANNER_COMMAND_DEFINITIONS } from './paper-planner-commands.js';
import { INTENT_ROUTE_PATHS } from './routes.js';
import type { CommandDefinition } from './types.js';

type CommandDefCore = Pick<
  CommandDefinition,
  | 'intent'
  | 'labelEs'
  | 'aliasesEs'
  | 'routePath'
  | 'requiredPermission'
  | 'requiresPatient'
  | 'priority'
  | 'match'
>;

function cmd(core: CommandDefCore): CommandDefinition {
  const meta = INTENT_SECURE_METADATA[core.intent];
  const def: CommandDefinition = {
    ...meta,
    ...core,
    description: meta.description,
    examples: meta.examples,
  };
  if (meta.formId !== undefined) {
    def.formId = meta.formId;
  }
  return def;
}

const COMMAND_DEFINITIONS_CORE: readonly CommandDefCore[] = [
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
      'buscar paciente juan',
      'abrir ficha de juan',
    ],
    routePath: INTENT_ROUTE_PATHS.search_patient,
    requiredPermission: 'command.execute',
    requiresPatient: false,
    priority: 10,
    match: (q) =>
      /abrir\s+busqueda/.test(q) ||
      /ir\s+a\s+buscar/.test(q) ||
      /abrir\s+ficha\s+(de|del)\s+\w/.test(q) ||
      /ver\s+ficha\s+(de|del)\s+\w/.test(q) ||
      (/paciente/.test(q) &&
        /(buscar|busca|encontrar|localizar|busqueda)/.test(q) &&
        !/resumen|resumir|resume|evolucion|epicrisis|receta|prescripcion|laboratorio|lab\b|analitica/.test(
          q,
        )),
  },
  {
    intent: 'open_patient_chart',
    labelEs: 'Abrir ficha del paciente',
    aliasesEs: [
      'abrir ficha',
      'ver ficha',
      'ir a ficha',
      'ir a la ficha',
      'mostrar ficha',
      'ficha del paciente',
      'abrir la ficha',
    ],
    routePath: INTENT_ROUTE_PATHS.open_patient_chart,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 11,
    match: (q) => {
      if (/\bficha\s+(de|del)\s+\w/.test(q)) return false;
      return (
        /^(abrir|ver|ir\s+a|mostrar)(\s+la)?\s+ficha(\s+del\s+paciente)?$/.test(q) ||
        (/\b(abrir|ver|ir\s+a|mostrar)\s+ficha\b/.test(q) && !/\bde\s+\w/.test(q))
      );
    },
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
      'resumir caso',
      'preguntar a la ia',
      'preguntarle a la ia por este paciente',
    ],
    routePath: INTENT_ROUTE_PATHS.summarize_patient,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 45,
    match: (q) =>
      (/resumen|resumir|resume|sintesis|historia/.test(q) &&
        !/laboratorio|lab\b|analitica|resultados|bandeja|epicrisis|evolucion|receta|prescripcion|alta|egreso|nota\s+de\s+egreso/.test(
          q,
        )) ||
      /ultimas\s*24/.test(q) ||
      /ver\s+sintesis/.test(q) ||
      /preguntar.*\bia\b|consultar\s+ia/.test(q),
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
      'crear evolución',
      'evolucion medica',
      'actualizar evolucion',
      'redactar evolucion',
      'evolucionar',
      'hacer evolucion',
      'evolucionar paciente',
      'crear nota diaria',
      'escribir soap',
      'nota diaria',
    ],
    routePath: INTENT_ROUTE_PATHS.create_evolution_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 50,
    match: (q) =>
      /evolucion|evoluciona|evolucionar|nota\s+de\s+evolucion|evolucion\s+diaria|nota\s+diaria|\bsoap\b/.test(
        q,
      ),
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
      'preparar alta',
      'nota de egreso',
      'hacer epicrisis',
      'revisar pendientes de alta',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_discharge_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 35,
    match: (q) =>
      /epicrisis|alta\s+(medica|hospitalaria)|preparar\s+alta|resumen\s+de\s+alta|egreso|discharge|nota\s+de\s+egreso|pendientes\s+de\s+alta|revisar\s+pendientes/.test(
        q,
      ),
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
      'imprimir receta',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_prescription,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 70,
    match: (q) =>
      /receta|prescripcion|prescripción|prescribe|recetar|medicamento|preparar\s+receta|preparar\s+prescripcion|imprimir\s+receta/.test(
        q,
      ),
  },
  {
    intent: 'open_results_inbox',
    labelEs: 'Bandeja de resultados',
    aliasesEs: [
      'bandeja de resultados',
      'ver resultados',
      'ver bandeja de resultados',
      'abrir resultados',
      'resultados criticos',
      'ver resultados criticos',
      'mostrar resultados',
      'ver examenes de hoy',
      'como esta el laboratorio',
      'revisar hemograma',
      'revisar imagenes',
    ],
    routePath: INTENT_ROUTE_PATHS.open_results_inbox,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 73,
    match: (q) =>
      /(bandeja\s+de\s+resultados|ver\s+bandeja|ver\s+resultados|abrir\s+resultados|resultados\s+criticos|mostrar\s+resultados|examenes\s+de\s+hoy|como\s+esta\s+el\s+laboratorio|revisar\s+hemograma|revisar\s+imagenes)/.test(
        q,
      ) && !/\b(solicitar|solicita|pedir|pide|orden)\b/.test(q),
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
      'solicitar hemograma',
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
      'hacer interconsulta',
      'interconsulta',
      'derivar a especialidad',
      'pedir interconsulta',
      'crear interconsulta a cardiologia',
    ],
    routePath: INTENT_ROUTE_PATHS.request_referral,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 76,
    match: (q) =>
      /solicitar\s+interconsulta|hacer\s+interconsulta|pedir\s+interconsulta|derivar\s+a\s+especialidad/.test(
        q,
      ) ||
      (/interconsulta/.test(q) && !/informe|respuesta|contestar|especialista/.test(q)),
  },
  {
    intent: 'request_imaging',
    labelEs: 'Imagenología',
    aliasesEs: [
      'solicitar imagen',
      'solicitar imagenologia',
      'solicitar tac',
      'solicita tac',
      'pedir tac',
      'pedir radiografia',
      'estudio de imagen',
      'orden de imagen',
      'pedir tac de torax',
    ],
    routePath: INTENT_ROUTE_PATHS.request_imaging,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 77,
    match: (q) =>
      /imagenologia|imagenología|radiografia|radiografía|\btac\b|\brm\b|tomografia|ecografia|solicitar\s+imagen|solicita\s+imagen|pedir\s+tac/.test(
        q,
      ),
  },
  {
    intent: 'request_procedure',
    labelEs: 'Solicitud de procedimiento',
    aliasesEs: [
      'solicitar procedimiento',
      'solicita procedimiento',
      'pedir procedimiento',
      'orden de procedimiento',
      'solicitar endoscopia',
      'pedir biopsia',
      'solicitar colonoscopia',
      'cateterismo',
    ],
    routePath: INTENT_ROUTE_PATHS.request_procedure,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 78,
    match: (q) =>
      /procedimiento|endoscop|biopsia|colonoscop|cateterismo|solicitar\s+proced/.test(q) &&
      !/nota\s+de\s+proced/.test(q),
  },
  {
    intent: 'create_nursing_note',
    labelEs: 'Nota de enfermería',
    aliasesEs: ['nota de enfermeria', 'nota enfermeria', 'registrar cuidados', 'signos vitales'],
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
      'ver mar',
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
    intent: 'reconcile_medications',
    labelEs: 'Conciliación medicamentosa',
    aliasesEs: [
      'conciliacion medicamentosa',
      'conciliacion de medicamentos',
      'revisa medicamentos',
      'revisar medicamentos',
      'validar conciliacion',
    ],
    routePath: INTENT_ROUTE_PATHS.reconcile_medications,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 67,
    match: (q) =>
      /conciliacion\s+(de\s+)?medicamentos|revis(a|ar)\s+medicamentos|validar\s+conciliacion/.test(
        q,
      ),
  },
  {
    intent: 'transfer_patient',
    labelEs: 'Nota de traslado',
    aliasesEs: [
      'traslado de paciente',
      'nota de traslado',
      'trasladar paciente',
      'cambio de cama',
      'mover de cama',
    ],
    routePath: INTENT_ROUTE_PATHS.transfer_patient,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 66,
    match: (q) =>
      /nota\s+de\s+traslado|traslad(o|ar)\s+(de\s+)?paciente|cambio\s+de\s+cama|mover\s+de\s+cama/.test(
        q,
      ),
  },
  {
    intent: 'create_outpatient_visit',
    labelEs: 'Consulta ambulatoria',
    aliasesEs: [
      'consulta ambulatoria',
      'atencion ambulatoria',
      'control ambulatorio',
      'visita ambulatoria',
      'nueva consulta',
    ],
    routePath: INTENT_ROUTE_PATHS.create_outpatient_visit,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 64,
    match: (q) =>
      /consulta\s+ambulatoria|atencion\s+ambulatoria|control\s+ambulatorio|visita\s+ambulatoria|nueva\s+consulta/.test(
        q,
      ),
  },
  {
    intent: 'create_medical_certificate',
    labelEs: 'Certificado médico',
    aliasesEs: [
      'certificado medico',
      'certificado de reposo',
      'emitir certificado',
      'licencia medica',
      'certificado de salud',
      'imprimir certificado',
    ],
    routePath: INTENT_ROUTE_PATHS.create_medical_certificate,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 63,
    match: (q) =>
      /certificado\s+(medico|de\s+reposo|de\s+salud)|emitir\s+certificado|licencia\s+medica|imprimir\s+certificado/.test(
        q,
      ),
  },
  {
    intent: 'respond_referral',
    labelEs: 'Informe de interconsulta',
    aliasesEs: [
      'informe de interconsulta',
      'respuesta interconsulta',
      'informe especialista',
      'contestar interconsulta',
    ],
    routePath: INTENT_ROUTE_PATHS.respond_referral,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 78,
    match: (q) =>
      /informe\s+(de\s+)?interconsulta|respuesta\s+interconsulta|contestar\s+interconsulta|informe\s+especialista/.test(
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
      'abrir farmacia',
      'revisar antibioticos',
    ],
    routePath: INTENT_ROUTE_PATHS.prepare_pharmacy_review,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 68,
    match: (q) =>
      /validacion\s+farmaceutica|farmacia\s+clinica|intervencion\s+farmacia|revisar\s+prescripcion|abrir\s+farmacia|revisar\s+antibioticos/.test(
        q,
      ),
  },
  {
    intent: 'register_allergy',
    labelEs: 'Registrar alergia',
    aliasesEs: [
      'registrar alergia',
      'anotar alergia',
      'nueva alergia',
      'alergia del paciente',
      'registro de alergia',
    ],
    routePath: INTENT_ROUTE_PATHS.register_allergy,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 61,
    match: (q) =>
      /registrar\s+alergia|anotar\s+alergia|nueva\s+alergia|registro\s+de\s+alergia|alergia\s+del\s+paciente/.test(
        q,
      ),
  },
  {
    intent: 'register_problem',
    labelEs: 'Registrar problema clínico',
    aliasesEs: [
      'registrar problema',
      'nuevo problema clinico',
      'anotar problema',
      'problema activo',
      'registro de problema',
      'registrar diagnostico',
      'nuevo diagnostico',
      'impresion diagnostica',
      'hipotesis diagnostica',
      'codigo cie-10',
      'comorbilidad',
    ],
    routePath: INTENT_ROUTE_PATHS.register_problem,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 60,
    match: (q) =>
      /registrar\s+(problema|diagnostico|diagnóstico)|nuevo\s+(problema|diagnostico|diagnóstico)|anotar\s+problema|problema\s+(clinico|activo)|registro\s+de\s+problema|impresion\s+diagnostica|hipotesis\s+diagnostica|cie-?10|comorbilidad/.test(
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
    match: (q) => /^ver\s+mi\s+trabajo/.test(q) || /mi\s+trabajo|mis\s+tareas|mi\s+bandeja/.test(q),
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
    intent: 'admit_patient_hospital',
    labelEs: 'Ingreso hospitalario',
    aliasesEs: [
      'ingreso hospitalario',
      'hospitalizar paciente',
      'admitir paciente',
      'ingreso a hospitalizacion',
    ],
    routePath: INTENT_ROUTE_PATHS.admit_patient_hospital,
    requiredPermission: 'draft.write',
    requiresPatient: true,
    priority: 77,
    match: (q) =>
      /ingreso\s+hospitalario|hospitalizar\s+paciente|admitir\s+paciente|ingreso\s+a\s+hospitalizacion/.test(
        q,
      ),
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
      (/\btablero\b/.test(q) && !/paciente|servicio|mi\s+trabajo/.test(q)) ||
      /\bver\s+indicadores\b/.test(q),
  },
] as const satisfies readonly CommandDefCore[];

export const EPIS2_COMMAND_DEFINITIONS: readonly CommandDefinition[] = [
  ...COMMAND_DEFINITIONS_CORE.map(cmd),
  ...PAPER_CHART_COMMAND_DEFINITIONS,
  ...PAPER_PLANNER_COMMAND_DEFINITIONS,
];

/** Frases que activan más de un intent con la misma prioridad — deben quedar ambiguas. */
export const AMBIGUOUS_PHRASES = [
  'resumen y laboratorio',
  'evolucion y epicrisis',
  'paciente resumen laboratorio',
] as const;
