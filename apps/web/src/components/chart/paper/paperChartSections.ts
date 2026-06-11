import { copy } from '@epis2/design-system';

/** IDs de sección modo papel (ADR-002). */
export const PAPER_CHART_SECTION_IDS = [
  'cover',
  'anamnesis',
  'physicalExam',
  'orders',
  'soap',
  'labs',
  'discharge',
] as const;

export type PaperChartSectionId = (typeof PAPER_CHART_SECTION_IDS)[number];

export function paperChartSectionLabel(id: PaperChartSectionId): string {
  return copy.chartModes.paperSections[id];
}

export type PaperChartSectionDraft = {
  id: PaperChartSectionId;
  body: string;
};

export const EMPTY_PAPER_CHART_DRAFT: Record<PaperChartSectionId, string> = {
  cover: '',
  anamnesis: '',
  physicalExam: '',
  orders: '',
  soap: '',
  labs: '',
  discharge: '',
};
