import type { ClinicalIntent, CommandActiveContext, CommandDefinition } from './types.js';
import { INTENT_SECURE_METADATA } from './intent-metadata.js';

/** Intents contextuales modo papel (MF-PAPER-08). */
export type PaperChartIntent = Extract<
  ClinicalIntent,
  | 'paper_order_soap'
  | 'paper_summarize_24h'
  | 'paper_prepare_print'
  | 'paper_prepare_discharge_draft'
  | 'paper_create_prescription_a5'
  | 'paper_detect_pending'
>;

export const PAPER_CHART_INTENTS: readonly PaperChartIntent[] = [
  'paper_order_soap',
  'paper_summarize_24h',
  'paper_prepare_print',
  'paper_prepare_discharge_draft',
  'paper_create_prescription_a5',
  'paper_detect_pending',
] as const;

export const PAPER_CHART_ROUTE_PATHS: Record<PaperChartIntent, string> = {
  paper_order_soap: '/espacio/ficha',
  paper_summarize_24h: '/espacio/resumen',
  paper_prepare_print: '/espacio/ficha/imprimir',
  paper_prepare_discharge_draft: '/espacio/ficha',
  paper_create_prescription_a5: '/espacio/receta',
  paper_detect_pending: '/espacio/ficha',
};

type PaperCmdCore = Pick<
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

function paperCmd(core: PaperCmdCore): CommandDefinition {
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

export const PAPER_CHART_COMMAND_DEFINITIONS: readonly CommandDefinition[] = [
  paperCmd({
    intent: 'paper_order_soap',
    labelEs: 'Ordenar en SOAP (papel)',
    aliasesEs: [
      'ordenar en soap',
      'insertar orden en soap',
      'anotar orden en seccion v',
      'escribir orden en soap',
      'orden medica en soap',
    ],
    routePath: PAPER_CHART_ROUTE_PATHS.paper_order_soap,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 88,
    match: (q) =>
      /orden(ar)?\s+(en\s+)?soap/.test(q) ||
      (/orden/.test(q) && /soap|seccion\s+v/.test(q)),
  }),
  paperCmd({
    intent: 'paper_summarize_24h',
    labelEs: 'Resumir últimas 24 h (papel)',
    aliasesEs: [
      'resumir ultimas 24 horas',
      'resumen ultimas 24h',
      'sintesis ultimo dia',
      'resumir evolucion reciente',
    ],
    routePath: PAPER_CHART_ROUTE_PATHS.paper_summarize_24h,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 86,
    match: (q) =>
      /ultimas?\s*24/.test(q) ||
      (/resum(ir|en)/.test(q) && /24|dia|jornada/.test(q) && /papel|ficha|soap/.test(q)),
  }),
  paperCmd({
    intent: 'paper_prepare_print',
    labelEs: 'Preparar impresión',
    aliasesEs: [
      'preparar impresion',
      'vista previa impresion',
      'imprimir ficha papel',
      'preparar documento para imprimir',
    ],
    routePath: PAPER_CHART_ROUTE_PATHS.paper_prepare_print,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 84,
    match: (q) =>
      /prepar(ar)?\s+(la\s+)?impresion/.test(q) ||
      (/imprimir|print/.test(q) && /ficha|papel|documento/.test(q)),
  }),
  paperCmd({
    intent: 'paper_prepare_discharge_draft',
    labelEs: 'Preparar epicrisis borrador',
    aliasesEs: [
      'preparar epicrisis borrador',
      'borrador epicrisis en papel',
      'completar alta en ficha',
      'epicrisis seccion vii',
    ],
    routePath: PAPER_CHART_ROUTE_PATHS.paper_prepare_discharge_draft,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 83,
    match: (q) =>
      (/epicrisis|alta|egreso/.test(q) && /borrador|papel|ficha/.test(q)) ||
      /prepar(ar)?\s+epicrisis/.test(q),
  }),
  paperCmd({
    intent: 'paper_create_prescription_a5',
    labelEs: 'Receta A5',
    aliasesEs: [
      'crear receta a5',
      'receta formato a5',
      'prescripcion a5',
      'imprimir receta a5',
    ],
    routePath: PAPER_CHART_ROUTE_PATHS.paper_create_prescription_a5,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 82,
    match: (q) =>
      (/receta|prescripcion/.test(q) && /a5|papel/.test(q)) || /crear\s+receta\s+a5/.test(q),
  }),
  paperCmd({
    intent: 'paper_detect_pending',
    labelEs: 'Detectar pendientes',
    aliasesEs: [
      'detectar pendientes',
      'ver pendientes ficha',
      'que falta en la ficha',
      'revisar borradores ia',
      'confirmar sugerencias ia',
    ],
    routePath: PAPER_CHART_ROUTE_PATHS.paper_detect_pending,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 90,
    match: (q) =>
      /detect(ar)?\s+pendientes/.test(q) ||
      (/pendiente|falta|ia|borrador/.test(q) && /ficha|papel|confirmar/.test(q)),
  }),
];

/** Sugerencias Ctrl+K en chartMode=paper (MF-PAPER-08). */
export function getPaperChartCommandSuggestions(): readonly string[] {
  return PAPER_CHART_COMMAND_DEFINITIONS.map((def) => def.aliasesEs[0] ?? def.labelEs);
}

export function isPaperChartIntent(intent: string): intent is PaperChartIntent {
  return (PAPER_CHART_INTENTS as readonly string[]).includes(intent);
}

const PAPER_CHART_INTENT_SET = new Set<string>(PAPER_CHART_INTENTS);

/** Boost ranking cuando ficha está en modo papel (MF-PAPER-08). */
export function paperChartIntentBoost(
  intent: ClinicalIntent,
  chartMode: CommandActiveContext['chartMode'],
): number {
  if (chartMode !== 'paper') return 0;
  return PAPER_CHART_INTENT_SET.has(intent) ? 14 : 0;
}
