import { describe, it, expect } from 'vitest';
import { loadDualChartLedger, validateDualChartLedger } from './dual-chart-ledger-lib.mjs';

describe('dual-chart ledger', () => {
  it('ledger canónico es válido — programa PROG-DUAL-CHART completo', () => {
    const ledger = loadDualChartLedger();
    const result = validateDualChartLedger(ledger);
    expect(result.ok, result.errors.join('; ')).toBe(true);
    expect(result.ready).toBeNull();
    expect(ledger.phases.length).toBe(10);
    const done = ledger.phases.filter((p) => p.state === 'DONE');
    expect(done.length).toBe(ledger.phases.length);
  });

  it('MF-DUAL-CHART-03 router cumple dependencia y cierre', () => {
    const ledger = loadDualChartLedger();
    const phase3 = ledger.phases.find((p) => p.id === 'MF-DUAL-CHART-03');
    expect(phase3?.state).toBe('DONE');
    expect(phase3?.dependsOn.includes('MF-DUAL-CHART-02')).toBe(true);
    expect(phase3?.closureReport).toBeTruthy();
  });
});
