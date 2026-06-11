import {
  EPIS2_PAPER_CHART_SECTION_TREE,
  PAPER_CHART_SECTION_IDS,
  type PaperChartSectionId,
} from '@epis2/clinical-forms';
import type { EpisNavigationSurface, EpisNavigationSurfaceStatus } from './epis2NavigationTree.js';

/** Superficies modo dual-chart — hijas de `/espacio/ficha` (no duplican registry 19 blueprints). */
export type PaperChartNavigationNode = {
  id: string;
  labelEs: string;
  route: string;
  chartMode?: 'traditional' | 'paper';
  sectionId?: PaperChartSectionId;
  status: EpisNavigationSurfaceStatus;
  notes?: string;
};

export const EPIS2_DUAL_CHART_MODE_SURFACES: readonly PaperChartNavigationNode[] = [
  {
    id: 'dual-chart-traditional',
    labelEs: 'Ficha clínica tradicional',
    route: '/espacio/ficha?chartMode=traditional',
    chartMode: 'traditional',
    status: 'complete',
    notes: '17 secciones clínicas · TraditionalEhrLayout',
  },
  {
    id: 'dual-chart-paper',
    labelEs: 'Ficha clínica papel (I–XIV)',
    route: '/espacio/ficha?chartMode=paper',
    chartMode: 'paper',
    status: 'complete',
    notes: '14 secciones · paper_chart SoT',
  },
  {
    id: 'paper-chart-print',
    labelEs: 'Impresión ficha papel',
    route: '/espacio/ficha/papel/imprimir',
    chartMode: 'paper',
    status: 'complete',
    notes: 'Carta/A5 · returnChartMode=paper',
  },
];

/** Secciones I–XIV como nodos navegables (tabs documento papel). */
export const EPIS2_PAPER_CHART_SECTION_SURFACES: readonly PaperChartNavigationNode[] =
  EPIS2_PAPER_CHART_SECTION_TREE.map((node) => ({
    id: `paper-section-${node.sectionId}`,
    labelEs: node.navLabelEs,
    route: `/espacio/ficha?chartMode=paper&section=${node.sectionId}`,
    chartMode: 'paper' as const,
    sectionId: node.sectionId,
    status: 'complete' as const,
  }));

export function assertPaperChartNavigationTreeInvariants(): string[] {
  const errors: string[] = [];
  if (EPIS2_PAPER_CHART_SECTION_SURFACES.length !== PAPER_CHART_SECTION_IDS.length) {
    errors.push('paperChartNavigationTree desincronizado con PAPER_CHART_SECTION_IDS');
  }
  const ids = new Set<string>();
  for (const node of [...EPIS2_DUAL_CHART_MODE_SURFACES, ...EPIS2_PAPER_CHART_SECTION_SURFACES]) {
    if (ids.has(node.id)) {
      errors.push(`id duplicado en árbol papel: ${node.id}`);
    }
    ids.add(node.id);
  }
  return errors;
}

/** Une modos dual-chart + secciones para documentación y gates. */
export function getPaperChartNavigationForest(): readonly PaperChartNavigationNode[] {
  return [...EPIS2_DUAL_CHART_MODE_SURFACES, ...EPIS2_PAPER_CHART_SECTION_SURFACES];
}

/** Compatibilidad con gates de navegación reconciliada. */
export function toEpisNavigationSurfaces(
  nodes: readonly PaperChartNavigationNode[],
): EpisNavigationSurface[] {
  return nodes.map((node) => ({
    id: node.id,
    labelEs: node.labelEs,
    route: node.route,
    kind: 'patient_hub' as const,
    workspace: 'ambulatory' as const,
    md3Level: 2 as const,
    status: node.status,
    ...(node.notes ? { notes: node.notes } : {}),
  }));
}
