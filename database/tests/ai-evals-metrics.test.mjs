/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import { computeEvalMetrics, percentile } from '../../scripts/ai-evals-metrics.mjs';
import { ACTIVE_TRAMO, blueprintsForTramo } from '../../scripts/ai-tramo-blueprints.mjs';

describe('ai-tramo-blueprints', () => {
  it('tramo activo J incluye farmacia', () => {
    expect(ACTIVE_TRAMO).toBe('J');
    const ids = blueprintsForTramo('J');
    expect(ids).toContain('pharmacy_validation');
    expect(ids).toContain('medication_reconciliation');
  });
});

describe('ai-evals-metrics', () => {
  it('calcula p95 y validJsonRate', () => {
    const metrics = computeEvalMetrics([
      { passed: true, latencyMs: 1000, contractValid: true },
      { passed: true, latencyMs: 2000, contractValid: true },
      { passed: false, latencyMs: 3000, contractValid: false },
      { passed: true, latencyMs: 4000, contractValid: true },
    ]);
    expect(metrics.p95LatencyMs).toBe(4000);
    expect(metrics.validJsonRate).toBe(0.75);
    expect(metrics.passRate).toBe(0.75);
  });

  it('percentile vacío devuelve 0', () => {
    expect(percentile([], 95)).toBe(0);
  });
});
