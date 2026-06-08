import { describe, expect, it } from 'vitest';
import { EPIS2_FORM_BLUEPRINTS } from './registry.js';
import {
  EPIS2_FORM_SCREEN_TREE,
  assertFormScreenTreeInvariants,
  getFormScreenNode,
  resolveFormScreenLayout,
} from './formScreenTree.js';

describe('EPIS2_FORM_SCREEN_TREE', () => {
  it('refleja los 20 blueprints del registry', () => {
    expect(EPIS2_FORM_SCREEN_TREE).toHaveLength(EPIS2_FORM_BLUEPRINTS.length);
    expect(assertFormScreenTreeInvariants()).toEqual([]);
  });

  it('asigna layouts canónicos conocidos', () => {
    expect(getFormScreenNode('evolution_note')?.layout).toBe('two-pane-context');
    expect(getFormScreenNode('outpatient_visit')?.layout).toBe('scrollspy-shell');
    expect(getFormScreenNode('patient_search')?.layout).toBe('search-grid');
    expect(getFormScreenNode('patient_summary')?.layout).toBe('read-only-summary');
    expect(getFormScreenNode('lab_request')?.layout).toBe('standard-form');
    expect(getFormScreenNode('procedure_request')?.layout).toBe('standard-form');
  });

  it('resolveFormScreenLayout prioriza búsqueda y solo lectura', () => {
    expect(resolveFormScreenLayout('patient_search', 'SEARCH')).toBe('search-grid');
    expect(resolveFormScreenLayout('patient_summary', 'READ_ONLY_SUMMARY')).toBe(
      'read-only-summary',
    );
  });
});
