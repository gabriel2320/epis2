import type { ChartModeId } from '../dev/dualChartModesEnv.js';
import type { PaperChartSectionId } from '../components/chart/paper/paperChartSections.js';
import { PAPER_CHART_SECTION_IDS } from '../components/chart/paper/paperChartSections.js';

/** Search params canónicos modo dual ficha (ADR-002). */
export type ChartModeSearch = {
  chartMode?: ChartModeId | undefined;
  section?: PaperChartSectionId | undefined;
  printFormat?: 'letter' | 'a5' | undefined;
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

  return parsed;
}

/** Default canónico cuando hay paciente fijado. */
export function resolveChartMode(search: ChartModeSearch): ChartModeId {
  return search.chartMode ?? 'traditional';
}
