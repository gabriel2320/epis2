import { describe, it, expect } from 'vitest';
import { dedupeEvolabFindings, formatEvolabFindingLine } from './openclaw-lib.mjs';

describe('openclaw evolab dedupe', () => {
  it('deduplica por escenario+fingerprint y conserva mayor severidad', () => {
    const items = [
      { scenarioId: 'admission-discharge-001', fingerprint: 'abc', severity: 'medium' },
      { scenarioId: 'admission-discharge-001', fingerprint: 'abc', severity: 'high' },
      { scenarioId: 'admission-discharge-001', fingerprint: 'abc', severity: 'medium' },
      { scenarioId: 'other-scenario', fingerprint: 'xyz', severity: 'high' },
    ];
    const out = dedupeEvolabFindings(items);
    expect(out).toHaveLength(2);
    const main = out.find((f) => f.fingerprint === 'abc');
    expect(main.severity).toBe('high');
    expect(main.runCount).toBe(3);
    expect(formatEvolabFindingLine(main)).toContain('(3 runs)');
  });
});
