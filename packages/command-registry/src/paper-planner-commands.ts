import type { ClinicalIntent, CommandActiveContext, CommandDefinition } from './types.js';
import { INTENT_SECURE_METADATA } from './intent-metadata.js';

/** Intents agenda papel (MF-PAPER-PLANNER-04). */
export type PaperPlannerIntent = Extract<
  ClinicalIntent,
  'paper_planner_summarize_day' | 'paper_planner_print_agenda' | 'paper_planner_review_pending'
>;

export const PAPER_PLANNER_INTENTS: readonly PaperPlannerIntent[] = [
  'paper_planner_summarize_day',
  'paper_planner_print_agenda',
  'paper_planner_review_pending',
] as const;

export const PAPER_PLANNER_ROUTE_PATHS: Record<PaperPlannerIntent, string> = {
  paper_planner_summarize_day: '/espacio/ficha',
  paper_planner_print_agenda: '/espacio/ficha/agenda/imprimir',
  paper_planner_review_pending: '/espacio/ficha',
};

type PlannerCmdCore = Pick<
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

function plannerCmd(core: PlannerCmdCore): CommandDefinition {
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

export const PAPER_PLANNER_COMMAND_DEFINITIONS: readonly CommandDefinition[] = [
  plannerCmd({
    intent: 'paper_planner_summarize_day',
    labelEs: 'Resumir agenda del día',
    aliasesEs: [
      'resumir agenda del dia',
      'sintesis agenda hoy',
      'resumen pendientes del dia',
      'agenda clinica del dia',
    ],
    routePath: PAPER_PLANNER_ROUTE_PATHS.paper_planner_summarize_day,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 87,
    match: (q) =>
      /resum(ir|en)\s+agenda/.test(q) ||
      (/agenda/.test(q) && /dia|hoy|jornada/.test(q) && /resum|sintesis|pendiente/.test(q)),
  }),
  plannerCmd({
    intent: 'paper_planner_print_agenda',
    labelEs: 'Imprimir agenda papel',
    aliasesEs: [
      'imprimir agenda',
      'imprimir agenda clinica',
      'vista previa agenda',
      'preparar impresion agenda',
    ],
    routePath: PAPER_PLANNER_ROUTE_PATHS.paper_planner_print_agenda,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 85,
    match: (q) => /imprimir\s+agenda/.test(q) || (/agenda/.test(q) && /imprimir|print|pdf/.test(q)),
  }),
  plannerCmd({
    intent: 'paper_planner_review_pending',
    labelEs: 'Revisar pendientes agenda',
    aliasesEs: [
      'revisar pendientes agenda',
      'pendientes del dia en agenda',
      'que falta en la agenda',
      'marcar pendientes agenda',
    ],
    routePath: PAPER_PLANNER_ROUTE_PATHS.paper_planner_review_pending,
    requiredPermission: 'command.execute',
    requiresPatient: true,
    priority: 89,
    match: (q) =>
      /pendientes?\s+agenda/.test(q) || (/agenda/.test(q) && /pendiente|falta|revisar/.test(q)),
  }),
];

export function getPaperPlannerCommandSuggestions(): readonly string[] {
  return PAPER_PLANNER_COMMAND_DEFINITIONS.map((def) => def.aliasesEs[0] ?? def.labelEs);
}

const PAPER_PLANNER_INTENT_SET = new Set<string>(PAPER_PLANNER_INTENTS);

/** Boost cuando ficha está en superficie agenda (MF-PAPER-PLANNER-04). */
export function paperPlannerIntentBoost(
  intent: ClinicalIntent,
  context: CommandActiveContext | undefined,
): number {
  if (context?.chartMode !== 'paper') return 0;
  if (context.paperSurface !== 'planner') return 0;
  return PAPER_PLANNER_INTENT_SET.has(intent) ? 16 : 0;
}
