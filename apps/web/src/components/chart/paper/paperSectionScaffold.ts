import type { PaperChartSectionId } from './paperChartSections.js';
import { isPaperChartSectionViiiXiv } from '@epis2/clinical-forms';

/** Filas mínimas textarea por sección — VIII–XIV requieren más espacio (MF-PA-04). */
const PAPER_SECTION_MIN_ROWS: Partial<Record<PaperChartSectionId, number>> = {
  cover: 3,
  nursing: 8,
  fluidBalance: 8,
  consults: 6,
  procedures: 8,
  imaging: 6,
  consent: 6,
  socialWork: 8,
};

export function resolvePaperSectionMinRows(sectionId: PaperChartSectionId): number {
  return PAPER_SECTION_MIN_ROWS[sectionId] ?? 5;
}

export function isPaperSectionScaffoldBatch2(sectionId: PaperChartSectionId): boolean {
  return isPaperChartSectionViiiXiv(sectionId);
}
