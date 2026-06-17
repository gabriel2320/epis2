import { findCicaScreenById, type CicaScreenDefinition } from './EPIS_CICA_SCREEN_REGISTRY.js';

/** IDs canónicos — alinear con EPIS_CICA_SCREEN_REGISTRY. */
export type CicaScreenId =
  | 'patient-search'
  | 'census'
  | 'recent-patients'
  | 'my-work'
  | 'agenda'
  | 'patient-summary'
  | 'patient-evolutions'
  | 'evolution-book'
  | 'evolution-detail'
  | 'new-evolution'
  | 'patient-admission'
  | 'patient-orders'
  | 'new-prescription'
  | 'patient-exams'
  | 'patient-medications'
  | 'patient-interconsultas'
  | 'patient-procedures'
  | 'patient-documents'
  | 'new-document'
  | 'patient-discharge'
  | 'new-epicrisis'
  | 'patient-timeline'
  | 'patient-audit'
  | 'paper-day'
  | 'paper-book';

export type CicaRouteParams = {
  'patient-search': Record<string, never>;
  census: Record<string, never>;
  'recent-patients': Record<string, never>;
  'my-work': Record<string, never>;
  agenda: Record<string, never>;
  'patient-summary': { patientId: string };
  'patient-evolutions': { patientId: string };
  'evolution-book': { patientId: string };
  'evolution-detail': { patientId: string; evolutionId: string };
  'new-evolution': { patientId: string };
  'patient-admission': { patientId: string };
  'patient-orders': { patientId: string };
  'new-prescription': { patientId: string };
  'patient-exams': { patientId: string };
  'patient-medications': { patientId: string };
  'patient-interconsultas': { patientId: string };
  'patient-procedures': { patientId: string };
  'patient-documents': { patientId: string };
  'new-document': { patientId: string };
  'patient-discharge': { patientId: string };
  'new-epicrisis': { patientId: string };
  'patient-timeline': { patientId: string };
  'patient-audit': { patientId: string };
  'paper-day': { patientId: string; date: string };
  'paper-book': { patientId: string };
};

/** Plantillas de ruta — fuente única para router, nav y tabs. */
export const CICA_ROUTE_TEMPLATE = {
  search: '/app/buscar',
  census: '/app/censo',
  recentPatients: '/app/recientes',
  myWork: '/app/mi-trabajo',
  agenda: '/app/agenda',
  patientSummary: '/app/pacientes/:patientId/resumen',
  patientEvolutions: '/app/pacientes/:patientId/evoluciones',
  evolutionBook: '/app/pacientes/:patientId/evoluciones/libro',
  evolutionDetail: '/app/pacientes/:patientId/evoluciones/:evolutionId',
  newEvolution: '/app/pacientes/:patientId/evoluciones/nueva',
  patientAdmission: '/app/pacientes/:patientId/ingreso',
  patientOrders: '/app/pacientes/:patientId/indicaciones',
  newPrescription: '/app/pacientes/:patientId/indicaciones/nueva',
  patientExams: '/app/pacientes/:patientId/examenes',
  patientMedications: '/app/pacientes/:patientId/medicamentos',
  patientInterconsultas: '/app/pacientes/:patientId/interconsultas',
  patientProcedures: '/app/pacientes/:patientId/procedimientos',
  patientDocuments: '/app/pacientes/:patientId/documentos',
  newDocument: '/app/pacientes/:patientId/documentos/nuevo',
  patientDischarge: '/app/pacientes/:patientId/alta',
  newEpicrisis: '/app/pacientes/:patientId/epicrisis/nueva',
  patientTimeline: '/app/pacientes/:patientId/timeline',
  patientAudit: '/app/pacientes/:patientId/auditoria',
  paperDay: '/app/pacientes/:patientId/papel/dia/:date',
  paperBook: '/app/pacientes/:patientId/papel/libro',
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

export function parseCicaEvolutionId(pathname: string): string | undefined {
  const match = pathname.match(/\/app\/pacientes\/[^/]+\/evoluciones\/([^/]+)/);
  const segment = match?.[1];
  if (!segment || segment === 'nueva' || segment === 'libro') return undefined;
  return segment;
}

export function isCicaPaperRoute(pathname: string): boolean {
  return pathname.includes('/papel/');
}

/** Documentos carta fullscreen — ocultar sidebar. */
export function isCicaLetterRoute(pathname: string): boolean {
  if (pathname.includes('/nueva')) return true;
  if (pathname.includes('/evoluciones/') && parseCicaEvolutionId(pathname)) return true;
  return false;
}

export function isCicaSidebarHiddenRoute(pathname: string): boolean {
  return isCicaPaperRoute(pathname) || isCicaLetterRoute(pathname);
}

export function cicaScreenTitle(screen: CicaScreenDefinition): string {
  return `EPIS2 · ${screen.intent.split(' ').slice(0, 3).join(' ')}`;
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
