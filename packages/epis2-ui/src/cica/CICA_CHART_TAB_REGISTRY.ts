import type { CicaScreenId } from './cicaRoutes.js';

/** Tab clínica de ficha — una fila en el registro = un tab visible. */
export type CicaChartTabId =
  | 'resumen'
  | 'evoluciones'
  | 'indicaciones'
  | 'examenes'
  | 'documentos'
  | 'papel';

export type CicaChartTabDefinition = {
  id: CicaChartTabId;
  /** Clave en copy.chartModes.classicTabs */
  labelKey: 'summary' | 'evolutions' | 'orders' | 'exams' | 'documents' | 'paper';
  screenId: CicaScreenId;
  /** Segmento bajo /app/pacientes/:patientId/ (papel usa :date) */
  pathKind: 'segment' | 'paper-day';
  segment: string;
};

/**
 * Registro de tabs ficha — modificar aquí para añadir/reordenar tabs CICA.
 * Debe mantenerse alineado con EPIS_CICA_SCREEN_REGISTRY.
 */
export const CICA_CHART_TAB_REGISTRY: readonly CicaChartTabDefinition[] = [
  {
    id: 'resumen',
    labelKey: 'summary',
    screenId: 'patient-summary',
    pathKind: 'segment',
    segment: 'resumen',
  },
  {
    id: 'evoluciones',
    labelKey: 'evolutions',
    screenId: 'patient-evolutions',
    pathKind: 'segment',
    segment: 'evoluciones',
  },
  {
    id: 'indicaciones',
    labelKey: 'orders',
    screenId: 'patient-orders',
    pathKind: 'segment',
    segment: 'indicaciones',
  },
  {
    id: 'examenes',
    labelKey: 'exams',
    screenId: 'patient-exams',
    pathKind: 'segment',
    segment: 'examenes',
  },
  {
    id: 'documentos',
    labelKey: 'documents',
    screenId: 'patient-documents',
    pathKind: 'segment',
    segment: 'documentos',
  },
  {
    id: 'papel',
    labelKey: 'paper',
    screenId: 'paper-day',
    pathKind: 'paper-day',
    segment: 'papel/dia',
  },
] as const;

export function findChartTabById(id: CicaChartTabId): CicaChartTabDefinition | undefined {
  return CICA_CHART_TAB_REGISTRY.find((t) => t.id === id);
}

export function inferChartTabFromPathname(pathname: string): CicaChartTabId {
  for (const tab of CICA_CHART_TAB_REGISTRY) {
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
  const tab = findChartTabById(tabId);
  return tab?.screenId ?? 'patient-summary';
}
