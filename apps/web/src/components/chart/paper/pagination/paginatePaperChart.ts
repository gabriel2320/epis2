import type { PaperChartSectionId } from '../paperChartSections.js';

/** Líneas útiles por hoja (grilla basal 6mm aprox.). */
export const PAPER_LINES_PER_PAGE = {
  letter: 44,
  a5: 34,
} as const;

export type PaperSectionEstimate = {
  sectionId: PaperChartSectionId;
  lines: number;
};

export type PaperPageLayout = {
  pageNumber: number;
  sections: PaperChartSectionId[];
  lineCount: number;
};

/**
 * Estima líneas de un bloque sección (título + contenido + minRows).
 * Evita cortar firmas: reserva mínimo 4 líneas al pie si incluye discharge.
 */
export function estimateBlockLines(
  sectionId: PaperChartSectionId,
  text: string,
  minRows: number,
  charsPerLine = 70,
): number {
  const headerLines = sectionId === 'cover' ? 5 : 3;
  const bodyLines = text.split('\n').reduce((sum, line) => {
    const trimmed = line.length;
    return sum + Math.max(1, Math.ceil(Math.max(trimmed, 1) / charsPerLine));
  }, 0);
  const signatureReserve = sectionId === 'discharge' ? 4 : 0;
  return Math.max(minRows + headerLines, bodyLines + headerLines) + signatureReserve;
}

/** Pagina secciones I–XIV respetando avoidBreakInside por sección cuando cabe. */
export function paginatePaperChart(
  sections: ReadonlyArray<{
    sectionId: PaperChartSectionId;
    value: string;
    minRows: number;
  }>,
  printFormat: 'letter' | 'a5' = 'letter',
): { pages: PaperPageLayout[]; totalPages: number } {
  const linesPerPage = PAPER_LINES_PER_PAGE[printFormat];
  const pages: PaperPageLayout[] = [];
  let current: PaperPageLayout = { pageNumber: 1, sections: [], lineCount: 0 };

  for (const { sectionId, value, minRows } of sections) {
    const blockLines = estimateBlockLines(sectionId, value, minRows);
    const wouldOverflow =
      current.sections.length > 0 && current.lineCount + blockLines > linesPerPage;

    if (wouldOverflow) {
      pages.push(current);
      current = {
        pageNumber: pages.length + 1,
        sections: [sectionId],
        lineCount: blockLines,
      };
    } else {
      current.sections.push(sectionId);
      current.lineCount += blockLines;
    }
  }

  if (current.sections.length > 0 || pages.length === 0) {
    pages.push(current);
  }

  const totalPages = Math.max(1, pages.length);
  return {
    pages: pages.map((p, i) => ({ ...p, pageNumber: i + 1 })),
    totalPages,
  };
}
