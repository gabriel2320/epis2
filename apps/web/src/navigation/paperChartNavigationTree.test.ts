import { PAPER_CHART_SECTION_IDS } from '@epis2/clinical-forms';
import { describe, expect, it } from 'vitest';
import {
  EPIS2_DUAL_CHART_MODE_SURFACES,
  EPIS2_PAPER_CHART_SECTION_SURFACES,
  assertPaperChartNavigationTreeInvariants,
  getPaperChartNavigationForest,
} from './paperChartNavigationTree.js';

describe('paperChartNavigationTree', () => {
  it('pasa invariantes del árbol dual-chart + secciones', () => {
    expect(assertPaperChartNavigationTreeInvariants()).toEqual([]);
  });

  it('expone modos traditional y paper', () => {
    const modes = EPIS2_DUAL_CHART_MODE_SURFACES.map((n) => n.chartMode);
    expect(modes).toContain('traditional');
    expect(modes).toContain('paper');
  });

  it('registra 14 superficies de sección I–XIV', () => {
    expect(EPIS2_PAPER_CHART_SECTION_SURFACES).toHaveLength(14);
    expect(EPIS2_PAPER_CHART_SECTION_SURFACES.map((n) => n.sectionId)).toEqual([
      ...PAPER_CHART_SECTION_IDS,
    ]);
  });

  it('forest une modos y secciones', () => {
    expect(getPaperChartNavigationForest()).toHaveLength(
      EPIS2_DUAL_CHART_MODE_SURFACES.length + EPIS2_PAPER_CHART_SECTION_SURFACES.length,
    );
  });
});
