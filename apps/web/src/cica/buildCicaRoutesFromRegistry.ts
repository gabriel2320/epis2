import { createRoute, type AnyRoute, type RouteComponent } from '@tanstack/react-router';
import {
  CICA_DRAFT_FORM_SCREEN_IDS,
  EPIS_CICA_SCREEN_REGISTRY,
  parseCicaDraftRouteSearch,
  type CicaScreenId,
} from '@epis2/epis2-ui';
import { CICA_ROUTE_COMPONENTS } from './cicaRouteComponents.js';

/** Orden = EPIS_CICA_SCREEN_REGISTRY (especificidad). Paths TanStack literales para inferencia. */
export const CICA_REGISTRY_ROUTE_WIRING = [
  { id: 'patient-search', path: '/app/buscar' },
  { id: 'census', path: '/app/censo' },
  { id: 'recent-patients', path: '/app/recientes' },
  { id: 'my-work', path: '/app/mi-trabajo' },
  { id: 'agenda', path: '/app/agenda' },
  { id: 'new-evolution', path: '/app/pacientes/$patientId/evoluciones/nueva' },
  { id: 'evolution-book', path: '/app/pacientes/$patientId/evoluciones/libro' },
  { id: 'evolution-detail', path: '/app/pacientes/$patientId/evoluciones/$evolutionId' },
  { id: 'patient-evolutions', path: '/app/pacientes/$patientId/evoluciones' },
  { id: 'new-prescription', path: '/app/pacientes/$patientId/indicaciones/nueva' },
  { id: 'new-document', path: '/app/pacientes/$patientId/documentos/nuevo' },
  { id: 'new-epicrisis', path: '/app/pacientes/$patientId/epicrisis/nueva' },
  { id: 'patient-admission', path: '/app/pacientes/$patientId/ingreso' },
  { id: 'patient-medications', path: '/app/pacientes/$patientId/medicamentos' },
  { id: 'patient-interconsultas', path: '/app/pacientes/$patientId/interconsultas' },
  { id: 'patient-procedures', path: '/app/pacientes/$patientId/procedimientos' },
  { id: 'patient-discharge', path: '/app/pacientes/$patientId/alta' },
  { id: 'patient-timeline', path: '/app/pacientes/$patientId/timeline' },
  { id: 'patient-audit', path: '/app/pacientes/$patientId/auditoria' },
  { id: 'paper-day', path: '/app/pacientes/$patientId/papel/dia/$date' },
  { id: 'paper-book', path: '/app/pacientes/$patientId/papel/libro' },
  { id: 'patient-summary', path: '/app/pacientes/$patientId/resumen' },
  { id: 'patient-orders', path: '/app/pacientes/$patientId/indicaciones' },
  { id: 'patient-exams', path: '/app/pacientes/$patientId/examenes' },
  { id: 'patient-documents', path: '/app/pacientes/$patientId/documentos' },
] as const satisfies ReadonlyArray<{ id: CicaScreenId; path: string }>;

function routeOptionsForScreen(screenId: CicaScreenId) {
  if ((CICA_DRAFT_FORM_SCREEN_IDS as readonly string[]).includes(screenId)) {
    return { validateSearch: parseCicaDraftRouteSearch };
  }
  return {};
}

function cicaRegistryRoute<const TPath extends string, const TId extends CicaScreenId>(
  parentRoute: AnyRoute,
  screenId: TId,
  path: TPath,
) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path,
    component: CICA_ROUTE_COMPONENTS[screenId] as RouteComponent,
    ...routeOptionsForScreen(screenId),
  });
}

/** Genera rutas TanStack desde wiring + registry (MF-PONY-06). */
export function buildCicaRoutesFromRegistry(parentRoute: AnyRoute) {
  const patientSearch = cicaRegistryRoute(parentRoute, 'patient-search', '/app/buscar');
  const census = cicaRegistryRoute(parentRoute, 'census', '/app/censo');
  const recentPatients = cicaRegistryRoute(parentRoute, 'recent-patients', '/app/recientes');
  const myWork = cicaRegistryRoute(parentRoute, 'my-work', '/app/mi-trabajo');
  const agenda = cicaRegistryRoute(parentRoute, 'agenda', '/app/agenda');
  const newEvolution = cicaRegistryRoute(
    parentRoute,
    'new-evolution',
    '/app/pacientes/$patientId/evoluciones/nueva',
  );
  const evolutionBook = cicaRegistryRoute(
    parentRoute,
    'evolution-book',
    '/app/pacientes/$patientId/evoluciones/libro',
  );
  const evolutionDetail = cicaRegistryRoute(
    parentRoute,
    'evolution-detail',
    '/app/pacientes/$patientId/evoluciones/$evolutionId',
  );
  const patientEvolutions = cicaRegistryRoute(
    parentRoute,
    'patient-evolutions',
    '/app/pacientes/$patientId/evoluciones',
  );
  const newPrescription = cicaRegistryRoute(
    parentRoute,
    'new-prescription',
    '/app/pacientes/$patientId/indicaciones/nueva',
  );
  const newDocument = cicaRegistryRoute(
    parentRoute,
    'new-document',
    '/app/pacientes/$patientId/documentos/nuevo',
  );
  const newEpicrisis = cicaRegistryRoute(
    parentRoute,
    'new-epicrisis',
    '/app/pacientes/$patientId/epicrisis/nueva',
  );
  const patientAdmission = cicaRegistryRoute(
    parentRoute,
    'patient-admission',
    '/app/pacientes/$patientId/ingreso',
  );
  const patientMedications = cicaRegistryRoute(
    parentRoute,
    'patient-medications',
    '/app/pacientes/$patientId/medicamentos',
  );
  const patientInterconsultas = cicaRegistryRoute(
    parentRoute,
    'patient-interconsultas',
    '/app/pacientes/$patientId/interconsultas',
  );
  const patientProcedures = cicaRegistryRoute(
    parentRoute,
    'patient-procedures',
    '/app/pacientes/$patientId/procedimientos',
  );
  const patientDischarge = cicaRegistryRoute(
    parentRoute,
    'patient-discharge',
    '/app/pacientes/$patientId/alta',
  );
  const patientTimeline = cicaRegistryRoute(
    parentRoute,
    'patient-timeline',
    '/app/pacientes/$patientId/timeline',
  );
  const patientAudit = cicaRegistryRoute(
    parentRoute,
    'patient-audit',
    '/app/pacientes/$patientId/auditoria',
  );
  const paperDay = cicaRegistryRoute(
    parentRoute,
    'paper-day',
    '/app/pacientes/$patientId/papel/dia/$date',
  );
  const paperBook = cicaRegistryRoute(
    parentRoute,
    'paper-book',
    '/app/pacientes/$patientId/papel/libro',
  );
  const patientSummary = cicaRegistryRoute(
    parentRoute,
    'patient-summary',
    '/app/pacientes/$patientId/resumen',
  );
  const patientOrders = cicaRegistryRoute(
    parentRoute,
    'patient-orders',
    '/app/pacientes/$patientId/indicaciones',
  );
  const patientExams = cicaRegistryRoute(
    parentRoute,
    'patient-exams',
    '/app/pacientes/$patientId/examenes',
  );
  const patientDocuments = cicaRegistryRoute(
    parentRoute,
    'patient-documents',
    '/app/pacientes/$patientId/documentos',
  );

  return [
    patientSearch,
    census,
    recentPatients,
    myWork,
    agenda,
    newEvolution,
    evolutionBook,
    evolutionDetail,
    patientEvolutions,
    newPrescription,
    newDocument,
    newEpicrisis,
    patientAdmission,
    patientMedications,
    patientInterconsultas,
    patientProcedures,
    patientDischarge,
    patientTimeline,
    patientAudit,
    paperDay,
    paperBook,
    patientSummary,
    patientOrders,
    patientExams,
    patientDocuments,
  ] as const;
}

export function listCicaRegistryScreenIds(): CicaScreenId[] {
  return EPIS_CICA_SCREEN_REGISTRY.map((screen) => screen.id as CicaScreenId);
}
