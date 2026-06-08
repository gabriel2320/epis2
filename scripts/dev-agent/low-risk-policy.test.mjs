/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import {
  applyLowRiskPatches,
  getPathTier,
  validatePatch,
} from '../../scripts/dev-agent/low-risk-policy.mjs';
import { parseDevLowRiskWritePlanFromOllamaText } from '../../scripts/dev-agent/parse-ollama-plan.mjs';
import { parseDevLowRiskWritePlan } from '../../scripts/dev-agent/schemas.mjs';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('low-risk-policy', () => {
  it('clasifica Tier L0 para reports', () => {
    expect(getPathTier('reports/epis2-test.md')).toBe('L0');
  });

  it('rechaza migraciones', () => {
    expect(getPathTier('database/migrations/034_x.sql')).toBe('forbidden');
  });

  it('rechama contenido auto-approve', () => {
    const result = validatePatch({
      path: 'reports/evil.md',
      action: 'create',
      content: 'auto-approve clinical draft',
      summary: 'x',
    });
    expect(result.ok).toBe(false);
  });

  it('aplica create en reports/', () => {
    const dir = mkdtempSync(join(tmpdir(), 'epis2-l0-'));
    const result = applyLowRiskPatches(
      [
        {
          path: 'reports/epis2-agent-test.md',
          action: 'create',
          content: '# Test\n\nContenido demo.',
          summary: 'test',
        },
      ],
      { root: dir, applyTier: 'L0' },
    );
    expect(result.errors).toHaveLength(0);
    expect(result.applied).toHaveLength(1);
    expect(readFileSync(join(dir, 'reports/epis2-agent-test.md'), 'utf8')).toContain('# Test');
    rmSync(dir, { recursive: true, force: true });
  });

  it('omite Tier L1 sin apply-all', () => {
    const dir = mkdtempSync(join(tmpdir(), 'epis2-l1-'));
    const gateDir = join(dir, 'scripts/quality');
    mkdirSync(gateDir, { recursive: true });
    writeFileSync(join(gateDir, 'validate-demo-gate.mjs'), '// gate\n', 'utf8');
    const result = applyLowRiskPatches(
      [
        {
          path: 'scripts/quality/validate-demo-gate.mjs',
          action: 'append',
          content: '// token check',
          summary: 'gate',
        },
      ],
      { root: dir, applyTier: 'L0' },
    );
    expect(result.applied).toHaveLength(0);
    expect(result.skipped).toHaveLength(1);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe('devLowRiskWritePlan schema', () => {
  it('parsea plan desde JSON envuelto', () => {
    const tag = 'think';
    const result = parseDevLowRiskWritePlanFromOllamaText(
      `<${tag}>ok</${tag}>` +
        JSON.stringify({
          objective: 'Documentar sesión',
          patches: [
            {
              path: 'reports/epis2-dev-write-test.md',
              action: 'create',
              content: '# Reporte\n',
              summary: 'reporte',
            },
          ],
          gatesToRun: ['npm run check'],
          manualFollowUps: [],
          risks: [],
          requiresHumanReview: true,
        }),
    );
    expect(result.ok).toBe(true);
  });

  it('rechaza plan sin requiresHumanReview', () => {
    const result = parseDevLowRiskWritePlan({
      objective: 'x',
      patches: [
        {
          path: 'reports/x.md',
          action: 'create',
          content: '# x',
          summary: 'x',
        },
      ],
      requiresHumanReview: false,
    });
    expect(result.ok).toBe(false);
  });
});
