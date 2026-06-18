import { copy } from '@epis2/design-system';
import { buildCicaPath, todayIsoDate, type CicaScreenId } from './cicaRoutes.js';

/** Tab ficha CICA — id canónico en `/app/*`. */
export type CicaChartTabId =
  | 'resumen'
  | 'evoluciones'
  | 'indicaciones'
  | 'examenes'
  | 'documentos'
  | 'papel';

/** Tab rail legacy `/espacio/*` (M3 — máx. 5). */
export type LegacyPatientChartTabId = 'summary' | 'history' | 'encounter' | 'results' | 'orders';

export type ClinicalChartTabDefinition = {
  id: CicaChartTabId;
  labelEs: string;
  screenId: CicaScreenId;
  pathKind: 'segment' | 'paper-day';
  segment: string;
  legacyTabId?: LegacyPatientChartTabId;
};

export type LegacyClinicalNavigateTarget = {
  to: string;
  search?: { patientId: string };
};

export type CicaPatientNavEntry =
  | { kind: 'tab'; tabId: CicaChartTabId }
  | {
      kind: 'screen';
      id: string;
      screenId: CicaScreenId;
      labelEs: string;
      pathMatch: string;
      planned?: boolean;
    };

/**
 * Registro único tabs ficha — CICA + adapter legacy.
 * Modificar aquí para añadir/reordenar tabs; sidebar L2 consume el mismo árbol.
 */
export const CLINICAL_CHART_TAB_REGISTRY: readonly ClinicalChartTabDefinition[] = [
  {
    id: 'resumen',
    labelEs: copy.chartModes.classicTabs.summary,
    screenId: 'patient-summary',
    pathKind: 'segment',
    segment: 'resumen',
    legacyTabId: 'summary',
  },
  {
    id: 'evoluciones',
    labelEs: copy.chartModes.classicTabs.evolutions,
    screenId: 'patient-evolutions',
    pathKind: 'segment',
    segment: 'evoluciones',
    legacyTabId: 'encounter',
  },
  {
    id: 'indicaciones',
    labelEs: copy.chartModes.classicTabs.orders,
    screenId: 'patient-orders',
    pathKind: 'segment',
    segment: 'indicaciones',
    legacyTabId: 'orders',
  },
  {
    id: 'examenes',
    labelEs: copy.chartModes.classicTabs.exams,
    screenId: 'patient-exams',
    pathKind: 'segment',
    segment: 'examenes',
    legacyTabId: 'results',
  },
  {
    id: 'documentos',
    labelEs: copy.chartModes.classicTabs.documents,
    screenId: 'patient-documents',
    pathKind: 'segment',
    segment: 'documentos',
  },
  {
    id: 'papel',
    labelEs: copy.clinicalNav.paper,
    screenId: 'paper-day',
    pathKind: 'paper-day',
    segment: 'papel/dia',
  },
] as const;

export type CicaChartTabDefinition = ClinicalChartTabDefinition;

const LEGACY_TAB_ROUTE_PREFIXES: Record<LegacyPatientChartTabId, readonly string[]> = {
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

const LEGACY_TAB_LABELS: Record<LegacyPatientChartTabId, string> = {
  summary: copy.patientChart.tabs.summary,
  history: copy.patientChart.tabs.history,
  encounter: copy.patientChart.tabs.encounter,
  results: copy.patientChart.tabs.results,
  orders: copy.patientChart.tabs.orders,
};

const LEGACY_TAB_ORDER: readonly LegacyPatientChartTabId[] = [
  'summary',
  'history',
  'encounter',
  'results',
  'orders',
];

/** L2 visible — master tree §3.2 (tabs + medicamentos + papel). */
export const CICA_PATIENT_PRIMARY_NAV: readonly CicaPatientNavEntry[] = [
  { kind: 'tab', tabId: 'resumen' },
  { kind: 'tab', tabId: 'evoluciones' },
  { kind: 'tab', tabId: 'indicaciones' },
  { kind: 'tab', tabId: 'examenes' },
  {
    kind: 'screen',
    id: 'medicamentos',
    screenId: 'patient-medications',
    labelEs: copy.chartModes.navMeds,
    pathMatch: '/medicamentos',
  },
  { kind: 'tab', tabId: 'documentos' },
  { kind: 'tab', tabId: 'papel' },
];

/** Overflow «Más» — master tree §3.2. */
export const CICA_PATIENT_MORE_NAV: readonly CicaPatientNavEntry[] = [
  {
    kind: 'screen',
    id: 'ingreso',
    screenId: 'patient-admission',
    labelEs: 'Ingreso clínico',
    pathMatch: '/ingreso',
  },
  {
    kind: 'screen',
    id: 'enfermeria',
    screenId: 'patient-admission',
    labelEs: 'Enfermería',
    pathMatch: '/enfermeria',
    planned: true,
  },
  {
    kind: 'screen',
    id: 'interconsultas',
    screenId: 'patient-interconsultas',
    labelEs: 'Interconsultas',
    pathMatch: '/interconsultas',
  },
  {
    kind: 'screen',
    id: 'procedimientos',
    screenId: 'patient-procedures',
    labelEs: 'Procedimientos',
    pathMatch: '/procedimientos',
  },
  {
    kind: 'screen',
    id: 'cirugia',
    screenId: 'patient-procedures',
    labelEs: 'Cirugía',
    pathMatch: '/cirugia',
    planned: true,
  },
  {
    kind: 'screen',
    id: 'uci',
    screenId: 'patient-admission',
    labelEs: 'UCI',
    pathMatch: '/uci',
    planned: true,
  },
  {
    kind: 'screen',
    id: 'alta',
    screenId: 'patient-discharge',
    labelEs: 'Epicrisis / alta',
    pathMatch: '/alta',
  },
  {
    kind: 'screen',
    id: 'timeline',
    screenId: 'patient-timeline',
    labelEs: 'Línea de tiempo',
    pathMatch: '/timeline',
  },
  {
    kind: 'screen',
    id: 'auditoria',
    screenId: 'patient-audit',
    labelEs: copy.chartModes.navAudit,
    pathMatch: '/auditoria',
  },
  {
    kind: 'screen',
    id: 'evolution-book',
    screenId: 'evolution-book',
    labelEs: 'Libro evoluciones',
    pathMatch: '/evoluciones/libro',
  },
  {
    kind: 'screen',
    id: 'paper-book',
    screenId: 'paper-book',
    labelEs: 'Libro clínico',
    pathMatch: '/papel/libro',
  },
];

export function findClinicalChartTabById(
  id: CicaChartTabId,
): ClinicalChartTabDefinition | undefined {
  return CLINICAL_CHART_TAB_REGISTRY.find((t) => t.id === id);
}

export function chartTabLabelEs(tabId: CicaChartTabId): string {
  return findClinicalChartTabById(tabId)?.labelEs ?? tabId;
}

export function buildCicaChartTabPath(
  tabId: CicaChartTabId,
  patientId: string,
  options?: { paperDate?: string },
): string {
  const tab = findClinicalChartTabById(tabId);
  if (!tab) {
    return buildCicaPath('patient-summary', { patientId });
  }
  if (tab.pathKind === 'paper-day') {
    return buildCicaPath('paper-day', {
      patientId,
      date: options?.paperDate ?? todayIsoDate(),
    });
  }
  return buildCicaPath(tab.screenId, { patientId });
}

export function inferChartTabFromPathname(pathname: string): CicaChartTabId {
  for (const tab of CLINICAL_CHART_TAB_REGISTRY) {
    if (tab.pathKind === 'paper-day' && pathname.includes('/papel/')) {
      return tab.id;
    }
    if (tab.pathKind === 'segment' && pathname.includes(`/${tab.segment}`)) {
      return tab.id;
    }
  }
  return 'resumen';
}

export function chartTabScreenId(tabId: CicaChartTabId): CicaScreenId {
  const tab = findClinicalChartTabById(tabId);
  return tab?.screenId ?? 'patient-summary';
}

/** Tabs legacy M3 para EpisPatientChartShell. */
export const LEGACY_PATIENT_CHART_TABS: Array<{ id: LegacyPatientChartTabId; label: string }> =
  LEGACY_TAB_ORDER.map((id) => ({
    id,
    label: LEGACY_TAB_LABELS[id],
  }));

export function resolveLegacyPatientChartTabId(pathname: string): LegacyPatientChartTabId {
  for (const [tabId, prefixes] of Object.entries(LEGACY_TAB_ROUTE_PREFIXES) as [
    LegacyPatientChartTabId,
    readonly string[],
  ][]) {
    if (prefixes.some((prefix) => pathname.startsWith(prefix))) {
      return tabId;
    }
  }
  return 'summary';
}

export function legacyPatientChartTabTarget(
  tabId: LegacyPatientChartTabId,
  patientId?: string,
): LegacyClinicalNavigateTarget {
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
