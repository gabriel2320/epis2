import { PAPER_CHART_SECTION_IDS, type PaperChartSectionId } from './schema.js';

/** Secciones I–VII — carátula…epicrisis. */
export const PAPER_CHART_SECTIONS_I_VII = PAPER_CHART_SECTION_IDS.slice(0, 7);

/** Secciones VIII–XIV — enfermería…trabajo social (MF-PA-04). */
export const PAPER_CHART_SECTIONS_VIII_XIV = PAPER_CHART_SECTION_IDS.slice(7);

export function isPaperChartSectionViiiXiv(sectionId: PaperChartSectionId): boolean {
  return (PAPER_CHART_SECTIONS_VIII_XIV as readonly string[]).includes(sectionId);
}

export function assertPaperChartSectionsViiiXivInvariants(): string[] {
  const errors: string[] = [];
  if (PAPER_CHART_SECTIONS_I_VII.length !== 7) {
    errors.push('PAPER_CHART_SECTIONS_I_VII debe tener 7 entradas');
  }
  if (PAPER_CHART_SECTIONS_VIII_XIV.length !== 7) {
    errors.push('PAPER_CHART_SECTIONS_VIII_XIV debe tener 7 entradas');
  }
  if (PAPER_CHART_SECTIONS_I_VII.length + PAPER_CHART_SECTIONS_VIII_XIV.length !== 14) {
    errors.push('I–VII + VIII–XIV debe sumar 14 secciones');
  }
  return errors;
}
