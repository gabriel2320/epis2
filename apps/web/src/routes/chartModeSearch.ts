import type { ChartModeId } from '../dev/dualChartModesEnv.js';
import type { PaperChartSectionId } from '../components/chart/paper/paperChartSections.js';
import { PAPER_CHART_SECTION_IDS } from '../components/chart/paper/paperChartSections.js';
import {
  isPaperPlannerSurface,
  isPaperPlannerView,
  type PaperPlannerSurface,
  type PaperPlannerView,
} from '../components/chart/paper/planner/types.js';

/** Search params canónicos modo dual ficha (ADR-002) + planner (ADR-003). */
export type ChartModeSearch = {
  chartMode?: ChartModeId | undefined;
  section?: PaperChartSectionId | undefined;
  printFormat?: 'letter' | 'a5' | undefined;
  paperSurface?: PaperPlannerSurface | undefined;
  plannerView?: PaperPlannerView | undefined;
};

const PRINT_FORMATS = new Set(['letter', 'a5']);

export function parseChartModeSearch(search: Record<string, unknown>): ChartModeSearch {
  const parsed: ChartModeSearch = {};

  if (search.chartMode === 'paper') {
    parsed.chartMode = 'paper';
  } else if (search.chartMode === 'traditional') {
    parsed.chartMode = 'traditional';
  }

  if (typeof search.section === 'string') {
    const section = search.section as PaperChartSectionId;
    if ((PAPER_CHART_SECTION_IDS as readonly string[]).includes(section)) {
      parsed.section = section;
    }
  }

  if (typeof search.printFormat === 'string' && PRINT_FORMATS.has(search.printFormat)) {
    parsed.printFormat = search.printFormat as 'letter' | 'a5';
  }

  if (typeof search.paperSurface === 'string' && isPaperPlannerSurface(search.paperSurface)) {
    parsed.paperSurface = search.paperSurface;
  }

  if (typeof search.plannerView === 'string' && isPaperPlannerView(search.plannerView)) {
    parsed.plannerView = search.plannerView;
  }

  return parsed;
}

/** Default canónico cuando hay paciente fijado. */
export function resolveChartMode(search: ChartModeSearch): ChartModeId {
  return search.chartMode ?? 'traditional';
}

export function resolvePaperSurface(search: ChartModeSearch): PaperPlannerSurface {
  return search.paperSurface ?? 'document';
}

export function resolvePlannerView(search: ChartModeSearch): PaperPlannerView {
  return search.plannerView ?? 'day';
}
