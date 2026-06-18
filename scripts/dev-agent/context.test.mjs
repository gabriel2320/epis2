/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { suggestPrimarySubagent, getGitSummary } from '../../scripts/dev-agent/context.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('dev-agent context', () => {
  it('sugiere golden-guardian para cambios web/CICA', () => {
    expect(
      suggestPrimarySubagent(['apps/web/src/cica/CicaCensusPage.tsx'], { phase: 'cica' }),
    ).toBe('golden-guardian');
  });

  it('sugiere tramo-implementer solo con EPIS2_ALLOW_ARCHIVED_SCOPE=1', () => {
    const prev = process.env.EPIS2_ALLOW_ARCHIVED_SCOPE;
    process.env.EPIS2_ALLOW_ARCHIVED_SCOPE = '1';
    expect(suggestPrimarySubagent([], { tramo: 'J' })).toBe('tramo-implementer');
    process.env.EPIS2_ALLOW_ARCHIVED_SCOPE = prev;
  });

  it('no sugiere tramo-implementer sin flag archivado', () => {
    const prev = process.env.EPIS2_ALLOW_ARCHIVED_SCOPE;
    delete process.env.EPIS2_ALLOW_ARCHIVED_SCOPE;
    expect(suggestPrimarySubagent([], { tramo: 'J' })).toBe('golden-guardian');
    process.env.EPIS2_ALLOW_ARCHIVED_SCOPE = prev;
  });

  it('git summary incluye rama', () => {
    const git = getGitSummary(root, 5);
    expect(git.branch).toBeTruthy();
    expect(Array.isArray(git.lines)).toBe(true);
  });

  it('getTableroState lee brújula PROG-PRODUCT-MAP', async () => {
    const { getTableroState } = await import('../../scripts/dev-agent/context.mjs');
    const state = getTableroState(root);
    expect(state.brujulaProgram).toMatch(/PROG-PRODUCT-MAP/);
    expect(state.activeThreads.length).toBeGreaterThan(0);
    expect(state.staleTableroHint).toBeNull();
  });
});
