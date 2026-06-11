#!/usr/bin/env node
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadDualChartLedger, validateDualChartLedger } from './dual-chart-ledger-lib.mjs';

test('dual-chart ledger válido con MF-DUAL-CHART-03 READY', () => {
  const ledger = loadDualChartLedger();
  const result = validateDualChartLedger(ledger);
  assert.equal(result.ok, true, result.errors.join('; '));
  assert.equal(result.ready?.id, 'MF-DUAL-CHART-03');
  assert.equal(ledger.phases.length, 6);
});

test('fases 0–2 DONE desbloquea fase 3', () => {
  const ledger = loadDualChartLedger();
  const phase2 = ledger.phases.find((p) => p.id === 'MF-DUAL-CHART-02');
  const phase3 = ledger.phases.find((p) => p.id === 'MF-DUAL-CHART-03');
  assert.equal(phase2?.state, 'DONE');
  assert.equal(phase3?.state, 'READY');
  assert.ok(phase3?.dependsOn.includes('MF-DUAL-CHART-02'));
});
