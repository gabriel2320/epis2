/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { suggestPrimarySubagent, getGitSummary } from '../../scripts/dev-agent/context.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('dev-agent context', () => {
  it('sugiere layers-integrator para cambios web', () => {
    expect(
      suggestPrimarySubagent(['apps/web/src/layouts/ClinicalShellLayout.tsx'], { phase: 'B' }),
    ).toBe('layers-integrator');
  });

  it('sugiere tramo-implementer cuando hay tramo', () => {
    expect(suggestPrimarySubagent([], { tramo: 'J' })).toBe('tramo-implementer');
  });

  it('git summary incluye rama', () => {
    const git = getGitSummary(root, 5);
    expect(git.branch).toBeTruthy();
    expect(Array.isArray(git.lines)).toBe(true);
  });
});
