import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { walkSourceFiles } from './lib/scan-sources.mjs';

const PROD_RUNTIME_ROOTS = ['apps/api/src', 'apps/web/src'];
const TEST_FILE = /\.(integration\.)?test\.(ts|tsx|js|mjs)$/;
const BRIDGE_ALLOW = /\/fixtures\/devFixturesBridge\./;

/** MF-CON-09 / RH-06 — production runtime must not statically import @epis2/test-fixtures. */
export async function validate() {
  const errors = [];

  for (const pkgRel of ['apps/api/package.json', 'apps/web/package.json']) {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, pkgRel), 'utf8'));
    if (pkg.dependencies?.['@epis2/test-fixtures']) {
      errors.push(`${pkgRel}: @epis2/test-fixtures debe estar en devDependencies, no dependencies`);
    }
  }

  for (const root of PROD_RUNTIME_ROOTS) {
    for await (const { rel, content } of walkSourceFiles({ roots: [root] })) {
      if (TEST_FILE.test(rel)) continue;
      if (BRIDGE_ALLOW.test(rel)) continue;
      if (!content.includes('@epis2/test-fixtures')) continue;
      errors.push(`${rel}: import estático prohibido de @epis2/test-fixtures en runtime prod`);
    }
  }

  return errors.length ? { ok: false, details: errors } : { ok: true };
}
