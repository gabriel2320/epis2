import type { TraditionalSectionId } from './TraditionalSectionNav.js';

/** Tabs clínicos visibles — MF-AEST-02b (5 + Más). */
export const CLASSIC_CHART_PRIMARY_TAB_IDS = [
  'summary',
  'evolutions',
  'orders',
  'exams',
  'documents',
] as const;

export const CLASSIC_CHART_MORE_TAB_ID = 'more' as const;

export const CLASSIC_CHART_TAB_IDS = [
  ...CLASSIC_CHART_PRIMARY_TAB_IDS,
  CLASSIC_CHART_MORE_TAB_ID,
] as const;

export type ClassicChartTabId = (typeof CLASSIC_CHART_TAB_IDS)[number];

/** Secciones legacy agrupadas bajo cada tab clínico. */
export const CLASSIC_CHART_TAB_SECTIONS: Record<
  ClassicChartTabId,
  readonly TraditionalSectionId[]
> = {
  summary: ['navSummary', 'navAdmin', 'navDiagnoses', 'navAllergies'],
  evolutions: ['navEvolution', 'navAnamnesis', 'navPhysicalExam', 'navAntecedents'],
  orders: ['navOrders'],
  exams: ['navLabs', 'navImaging'],
  documents: ['navDocuments', 'navConsults', 'navEpicrisis', 'navProcedures'],
  more: ['navMeds', 'navAudit'],
};

export function defaultSectionForTab(tab: ClassicChartTabId): TraditionalSectionId {
  return CLASSIC_CHART_TAB_SECTIONS[tab][0]!;
}

export function tabForSection(section: TraditionalSectionId): ClassicChartTabId {
  for (const tab of CLASSIC_CHART_TAB_IDS) {
    if ((CLASSIC_CHART_TAB_SECTIONS[tab] as readonly string[]).includes(section)) {
      return tab;
    }
  }
  return 'summary';
}

export function visibleSectionsForTab(
  tab: ClassicChartTabId,
  visibleSectionIds: readonly TraditionalSectionId[],
): TraditionalSectionId[] {
  return CLASSIC_CHART_TAB_SECTIONS[tab].filter((id) => visibleSectionIds.includes(id));
}

/** CICA-L — una sección primaria por tab; subsecciones demo van a comando / fases posteriores. */
export const CICA_CLASSIC_TAB_PRIMARY_SECTION: Partial<
  Record<ClassicChartTabId, TraditionalSectionId>
> = {
  summary: 'navSummary',
  evolutions: 'navEvolution',
  orders: 'navOrders',
  exams: 'navLabs',
  documents: 'navDocuments',
  more: 'navMeds',
};

export function visibleSectionsForCicaClassicTab(
  tab: ClassicChartTabId,
  visibleSectionIds: readonly TraditionalSectionId[],
): TraditionalSectionId[] {
  const primary = CICA_CLASSIC_TAB_PRIMARY_SECTION[tab];
  if (primary && visibleSectionIds.includes(primary)) {
    return [primary];
  }
  return visibleSectionsForTab(tab, visibleSectionIds);
}
