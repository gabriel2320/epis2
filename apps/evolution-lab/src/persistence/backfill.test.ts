import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { parseRunBundleFromDir } from './backfill.js';

describe('backfill', () => {
  it('parsea bundle desde reports/evolution/runs existente', () => {
    const runDir = join(
      process.cwd(),
      'reports/evolution/runs/aafd3e1d-687f-4ca0-a67f-98de404b4a7f',
    );
    const bundle = parseRunBundleFromDir(runDir);
    expect(bundle).not.toBeNull();
    expect(bundle!.run.scenarioId).toBe('discharge-critical-pending-001');
    expect(bundle!.finalStatus).toBe('human_review');
    expect(bundle!.evaluations.length).toBeGreaterThan(0);
    expect(bundle!.findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('retorna null si falta metadata o result', () => {
    expect(parseRunBundleFromDir(process.cwd())).toBeNull();
  });
});
