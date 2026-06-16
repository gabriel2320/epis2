import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { walkSourceFiles } from './lib/scan-sources.mjs';
import { validateCoreLabsBoundary } from './core-labs-boundary.mjs';

/** MF-CON-03 — docs de gobierno + frontera web sin runtime local-ai directo. */
const REQUIRED_DOCS = [
  'docs/MONOREPO_GOVERNANCE.md',
  'docs/DOCUMENTATION_GOVERNANCE.md',
  'docs/CONSOLIDATION_FREEZE.md',
  'reports/README.md',
  'reports/archive/2026-06/README.md',
];

/** MF-CON-10 — documentación legal mínima en raíz (revisión humana recomendada). */
const REQUIRED_ROOT_LEGAL = ['LICENSE', 'SECURITY.md', 'DISCLAIMER.md', 'CONTRIBUTING.md'];

const WEB_FORBIDDEN_IMPORTS = [
  '@epis2/local-ai',
  'services/local-ai',
  'services/clinical-case-intel',
  '@epis2/clinical-domain/node',
  '@epis2/test-fixtures/node',
  '@epis2/test-fixtures',
];

export async function validate() {
  const errors = [];

  for (const doc of REQUIRED_DOCS) {
    if (!existsSync(join(REPO_ROOT, doc))) {
      errors.push(`Falta doc gobierno: ${doc}`);
    }
  }

  for (const doc of REQUIRED_ROOT_LEGAL) {
    if (!existsSync(join(REPO_ROOT, doc))) {
      errors.push(`Falta doc legal raíz: ${doc}`);
    }
  }

  const freezePath = join(REPO_ROOT, 'docs/CONSOLIDATION_FREEZE.md');
  if (existsSync(freezePath)) {
    const freeze = readFileSync(freezePath, 'utf8');
    if (!freeze.includes('MONOREPO_GOVERNANCE.md')) {
      errors.push('CONSOLIDATION_FREEZE debe referenciar MONOREPO_GOVERNANCE.md');
    }
  }

  for await (const { rel, content } of walkSourceFiles({ roots: ['apps/web'] })) {
    if (rel === 'apps/web/package.json') {
      const pkg = JSON.parse(content);
      if (pkg.dependencies?.['@epis2/test-fixtures']) {
        errors.push(`${rel}: @epis2/test-fixtures debe estar en devDependencies`);
      }
      continue;
    }
    if (rel.includes('/fixtures/devFixturesBridge.')) continue;
    for (const bad of WEB_FORBIDDEN_IMPORTS) {
      if (content.includes(bad)) {
        errors.push(`${rel}: import/runtime prohibido (${bad})`);
      }
    }
  }

  const labsBoundary = await validateCoreLabsBoundary();
  if (!labsBoundary.ok) {
    errors.push(...labsBoundary.details);
  }

  return errors.length ? { ok: false, details: errors } : { ok: true };
}
