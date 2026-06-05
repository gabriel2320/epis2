import { describe, expect, it } from 'vitest';
import { buildObservationTrend, parseNumericObservation } from './observationTrend.js';

describe('observationTrend', () => {
  it('extrae número de valueText clínico', () => {
    expect(parseNumericObservation('2.4 (sintético)')).toBe(2.4);
    expect(parseNumericObservation('88 lpm (sintético)')).toBe(88);
  });

  it('ordena serie INR por observedAt', () => {
    const trend = buildObservationTrend(
      [
        { label: 'INR', valueText: '2.3', observedAt: '2026-06-03T10:00:00.000Z' },
        { label: 'INR', valueText: '1.9', observedAt: '2026-06-01T10:00:00.000Z' },
      ],
      'INR',
    );
    expect(trend.values).toEqual([1.9, 2.3]);
    expect(trend.xAxisLabels).toHaveLength(2);
  });
});
