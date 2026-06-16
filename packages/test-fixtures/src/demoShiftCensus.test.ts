import { describe, expect, it } from 'vitest';
import {
  assertDemoShiftCensusInvariants,
  getDemoShiftCensusPresentation,
  listDemoShiftCensusPresentations,
} from './demoShiftCensus.js';

describe('demoShiftCensus', () => {
  it('invariantes PROG-UX-LAB', () => {
    expect(assertDemoShiftCensusInvariants()).toEqual([]);
  });

  it('expone 5 pacientes DEMO', () => {
    expect(listDemoShiftCensusPresentations()).toHaveLength(5);
  });

  it('DEMO-001 evolución pendiente', () => {
    expect(getDemoShiftCensusPresentation('DEMO-001')?.primaryAction).toBe('create_evolution');
  });

  it('DEMO-003 borrador en revisión', () => {
    expect(getDemoShiftCensusPresentation('DEMO-003')?.draftState).toBe('ready_for_review');
  });
});
