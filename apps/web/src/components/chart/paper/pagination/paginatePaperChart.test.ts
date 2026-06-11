import { describe, expect, it } from 'vitest';
import { PAPER_CHART_SECTION_IDS } from '../paperChartSections.js';
import { estimateBlockLines, paginatePaperChart } from './paginatePaperChart.js';

describe('paginatePaperChart', () => {
  it('estima al menos minRows por sección', () => {
    const lines = estimateBlockLines('anamnesis', '', 5);
    expect(lines).toBeGreaterThanOrEqual(8);
  });

  it('reserva líneas extra en discharge (firma)', () => {
    const short = estimateBlockLines('discharge', 'Alta', 5);
    const long = estimateBlockLines('labs', 'Alta', 5);
    expect(short).toBeGreaterThan(long);
  });

  it('pagina documento vacío en al menos 1 hoja', () => {
    const sections = PAPER_CHART_SECTION_IDS.map((id) => ({
      sectionId: id,
      value: '',
      minRows: id === 'cover' ? 3 : 5,
    }));
    const { totalPages, pages } = paginatePaperChart(sections, 'letter');
    expect(totalPages).toBeGreaterThanOrEqual(1);
    expect(pages[0]?.sections.length).toBeGreaterThan(0);
  });

  it('parte secciones largas en varias páginas', () => {
    const longText = 'Línea clínica detallada. '.repeat(200);
    const sections = PAPER_CHART_SECTION_IDS.map((id) => ({
      sectionId: id,
      value: id === 'anamnesis' ? longText : '',
      minRows: 5,
    }));
    const { totalPages } = paginatePaperChart(sections, 'letter');
    expect(totalPages).toBeGreaterThan(1);
  });
});
