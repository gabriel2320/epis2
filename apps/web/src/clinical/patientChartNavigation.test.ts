import { describe, expect, it } from 'vitest';
import { PATIENT_CHART_TABS } from './patientChartNavigation.js';

describe('patientChartNavigation adapter', () => {
  it('expone tabs legacy desde clinical-chart-tabs', () => {
    expect(PATIENT_CHART_TABS.map((t) => t.id)).toEqual([
      'summary',
      'history',
      'encounter',
      'results',
      'orders',
    ]);
  });
});
