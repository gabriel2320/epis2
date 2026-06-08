/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { blueprintsForTramo } from '../../scripts/ai-tramo-blueprints.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('dev-automation week4', () => {
  it('tramo K tiene blueprints assist', () => {
    const ids = blueprintsForTramo('K');
    expect(ids).toContain('evolution_note');
    expect(ids?.length).toBeGreaterThanOrEqual(3);
  });

  it('checklist signoff referencia tramos A–J', () => {
    const text = readFileSync(
      join(root, 'docs/product/EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md'),
      'utf8',
    );
    expect(text).toContain('quality:tramo-j-closure-gate');
    expect(text).toContain('ai:evals:closure');
  });

  it('scripts cierre evals y orquestador subagentes existen', () => {
    expect(existsSync(join(root, 'scripts/run-tramo-closure-evals.mjs'))).toBe(true);
    expect(existsSync(join(root, 'scripts/dev-agent/session.mjs'))).toBe(true);
    expect(existsSync(join(root, 'scripts/dev-agent/brief.mjs'))).toBe(true);
    expect(existsSync(join(root, 'scripts/dev-agent/close.mjs'))).toBe(true);
    expect(existsSync(join(root, 'docs/product/EPIS2_AI_ASSISTED_DEV.md'))).toBe(true);
  });
});
