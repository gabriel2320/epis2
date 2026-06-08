/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import { parseDevSessionPlan } from '../../scripts/dev-agent/schemas.mjs';

describe('dev-agent schemas', () => {
  it('rechaza plan sin requiresHumanReview', () => {
    const result = parseDevSessionPlan({
      activePhase: 'B',
      nextMicrophase: 'MF-FASE-B-001',
      objective: 'Command palette',
      allowedPaths: ['apps/web/src/layouts'],
      gatesToRun: ['npm run check'],
      subagentSequence: ['layers-integrator'],
      requiresHumanReview: false,
    });
    expect(result.ok).toBe(false);
  });

  it('acepta plan dev válido', () => {
    const result = parseDevSessionPlan({
      activePhase: 'B',
      nextMicrophase: 'MF-FASE-B-COMMAND-PALETTE',
      objective: 'Integrar ClinicalCommandPalette en shell',
      allowedPaths: ['apps/web/src/layouts', 'packages/clinical-productivity'],
      forbiddenPatterns: ['OpenMRS'],
      gatesToRun: ['npm run check', 'quality:layers-integration-gate'],
      subagentSequence: ['layers-integrator', 'gate-runner'],
      risks: ['Duplicar registry comando'],
      requiresHumanReview: true,
    });
    expect(result.ok).toBe(true);
  });
});
