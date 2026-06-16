import { findCicaScreenById, type CicaScreenDefinition } from './EPIS_CICA_SCREEN_REGISTRY.js';

/** IDs canónicos — alinear con EPIS_CICA_SCREEN_REGISTRY. */
export type CicaScreenId =
  | 'patient-search'
  | 'census'
  | 'patient-summary'
  | 'patient-evolutions'
  | 'new-evolution'
  | 'patient-orders'
  | 'new-prescription'
  | 'patient-exams'
  | 'patient-documents'
  | 'new-document'
  | 'new-epicrisis'
  | 'paper-day';

export type CicaRouteParams = {
  'patient-search': Record<string, never>;
  census: Record<string, never>;
  'patient-summary': { patientId: string };
  'patient-evolutions': { patientId: string };
  'new-evolution': { patientId: string };
  'patient-orders': { patientId: string };
  'new-prescription': { patientId: string };
  'patient-exams': { patientId: string };
  'patient-documents': { patientId: string };
  'new-document': { patientId: string };
  'new-epicrisis': { patientId: string };
  'paper-day': { patientId: string; date: string };
};

/** Plantillas de ruta — fuente única para router, nav y tabs. */
export const CICA_ROUTE_TEMPLATE = {
  search: '/app/buscar',
  census: '/app/censo',
  patientSummary: '/app/pacientes/:patientId/resumen',
  patientEvolutions: '/app/pacientes/:patientId/evoluciones',
  newEvolution: '/app/pacientes/:patientId/evoluciones/nueva',
  patientOrders: '/app/pacientes/:patientId/indicaciones',
  newPrescription: '/app/pacientes/:patientId/indicaciones/nueva',
  patientExams: '/app/pacientes/:patientId/examenes',
  patientDocuments: '/app/pacientes/:patientId/documentos',
  newDocument: '/app/pacientes/:patientId/documentos/nuevo',
  newEpicrisis: '/app/pacientes/:patientId/epicrisis/nueva',
  paperDay: '/app/pacientes/:patientId/papel/dia/:date',
} as const;

function fillRoute(template: string, params: Record<string, string>): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    template,
  );
}

/** Construye path `/app` desde screenId + params (para nav, links, tests). */
export function buildCicaPath<TId extends CicaScreenId>(
  screenId: TId,
  params?: CicaRouteParams[TId],
): string {
  const screen = findCicaScreenById(screenId);
  if (!screen) {
    throw new Error(`CICA screen desconocida: ${screenId}`);
  }
  if (!params) {
    return screen.route;
  }
  return fillRoute(screen.route, params as Record<string, string>);
}

export function parseCicaPatientId(pathname: string): string | undefined {
  const match = pathname.match(/\/app\/pacientes\/([^/]+)/);
  return match?.[1];
}

export function isCicaPaperRoute(pathname: string): boolean {
  return pathname.includes('/papel/');
}

export function cicaScreenTitle(screen: CicaScreenDefinition): string {
  return `EPIS2 · ${screen.intent.split(' ').slice(0, 3).join(' ')}`;
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
