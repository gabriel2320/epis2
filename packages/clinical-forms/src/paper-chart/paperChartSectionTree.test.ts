import { describe, expect, it } from 'vitest';
import { PAPER_CHART_SECTION_IDS } from './schema.js';
import {
  EPIS2_PAPER_CHART_SECTION_TREE,
  assertPaperChartSectionTreeInvariants,
  getPaperChartSectionTreeNode,
} from './paperChartSectionTree.js';

describe('paperChartSectionTree', () => {
  it('pasa invariantes del árbol I–XIV', () => {
    expect(assertPaperChartSectionTreeInvariants()).toEqual([]);
  });

  it('expone 14 secciones ordenadas', () => {
    expect(EPIS2_PAPER_CHART_SECTION_TREE).toHaveLength(14);
    expect(EPIS2_PAPER_CHART_SECTION_TREE[0]?.roman).toBe('I');
    expect(EPIS2_PAPER_CHART_SECTION_TREE[13]?.roman).toBe('XIV');
    expect(EPIS2_PAPER_CHART_SECTION_TREE[13]?.sectionId).toBe('socialWork');
  });

  it('alinea ids con PAPER_CHART_SECTION_IDS', () => {
    expect(EPIS2_PAPER_CHART_SECTION_TREE.map((n) => n.sectionId)).toEqual([
      ...PAPER_CHART_SECTION_IDS,
    ]);
  });

  it('resuelve nodo por sectionId', () => {
    const node = getPaperChartSectionTreeNode('nursing');
    expect(node?.roman).toBe('VIII');
    expect(node?.navLabelEs).toBe('VIII. Enfermería');
  });
});
