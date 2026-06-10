import { copy } from '@epis2/design-system';
import type { EpisPatientChartTab } from '@epis2/epis2-ui';
import type { ClinicalNavigateOptions } from '../routes/clinicalNavigate.js';

/** Máximo 5 Primary Tabs — ramas cronológicas de la ficha (Nivel 2). */
export const PATIENT_CHART_TABS: EpisPatientChartTab[] = [
  { id: 'summary', label: copy.patientChart.tabs.summary },
  { id: 'history', label: copy.patientChart.tabs.history },
  { id: 'encounter', label: copy.patientChart.tabs.encounter },
  { id: 'results', label: copy.patientChart.tabs.results },
  { id: 'orders', label: copy.patientChart.tabs.orders },
];

export type PatientChartTabId = (typeof PATIENT_CHART_TABS)[number]['id'];

const TAB_ROUTE_PREFIXES: Record<PatientChartTabId, readonly string[]> = {
  summary: ['/espacio/ficha', '/espacio/resumen'],
  history: ['/espacio/ficha'],
  encounter: ['/espacio/evolucion', '/espacio/ambulatorio', '/espacio/enfermeria'],
  results: ['/espacio/resultados', '/espacio/laboratorio', '/espacio/imagenologia'],
  orders: [
    '/espacio/receta',
    '/espacio/mar',
    '/espacio/farmacia',
    '/espacio/interconsulta',
    '/espacio/certificado',
  ],
};

export function resolvePatientChartTabId(pathname: string): PatientChartTabId {
  for (const [tabId, prefixes] of Object.entries(TAB_ROUTE_PREFIXES) as [
    PatientChartTabId,
    readonly string[],
  ][]) {
    if (prefixes.some((prefix) => pathname.startsWith(prefix))) {
      return tabId;
    }
  }
  return 'summary';
}

export function patientChartTabTarget(
  tabId: PatientChartTabId,
  patientId?: string,
): ClinicalNavigateOptions {
  const search = patientId ? { patientId } : undefined;
  switch (tabId) {
    case 'summary':
    case 'history':
      return { to: '/espacio/ficha', ...(search ? { search } : {}) };
    case 'encounter':
      return { to: '/espacio/evolucion', ...(search ? { search } : {}) };
    case 'results':
      return { to: '/espacio/resultados', ...(search ? { search } : {}) };
    case 'orders':
      return { to: '/espacio/receta', ...(search ? { search } : {}) };
    default:
      return { to: '/espacio/ficha', ...(search ? { search } : {}) };
  }
}
