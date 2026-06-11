import { describe, expect, it } from 'vitest';
import {
  DEMO_CHART_PRIORITY_SECTIONS,
  assertDemoChartSectionsInvariants,
  getDemoChartSectionRows,
} from './demoChartSections.js';

describe('demoChartSections (MF-NORM-06)', () => {
  it('invariantes 5 casos × 5 secciones', () => {
    expect(assertDemoChartSectionsInvariants()).toEqual([]);
  });

  it('DEMO-005 alergia penicilina', () => {
    const rows = getDemoChartSectionRows('DEMO-005', 'navAllergies');
    expect(rows[0]?.label).toBe('Penicilina');
  });

  it('cubre las 5 secciones prioritarias TE-02', () => {
    expect(DEMO_CHART_PRIORITY_SECTIONS).toHaveLength(5);
  });
});
