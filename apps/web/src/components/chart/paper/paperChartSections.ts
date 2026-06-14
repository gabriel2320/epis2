import { PAPER_CHART_SECTION_IDS, type PaperChartSectionId } from '@epis2/clinical-forms';
import { copy } from '@epis2/design-system';

/** Re-export SoT — `@epis2/clinical-forms` schema + árbol I–XIV. */
export { PAPER_CHART_SECTION_IDS, type PaperChartSectionId };

export function paperChartSectionLabel(id: PaperChartSectionId): string {
  return copy.chartModes.paperSections[id];
}

export type PaperChartSectionDraft = {
  id: PaperChartSectionId;
  body: string;
};

export const EMPTY_PAPER_CHART_DRAFT: Record<PaperChartSectionId, string> = Object.fromEntries(
  PAPER_CHART_SECTION_IDS.map((id) => [id, '']),
) as Record<PaperChartSectionId, string>;
