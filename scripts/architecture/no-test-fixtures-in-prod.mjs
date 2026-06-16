import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { walkSourceFiles } from './lib/scan-sources.mjs';

const PROD_API_ROOT = 'apps/api/src';
const TEST_FILE = /\.(integration\.)?test\.(ts|tsx|js|mjs)$/;

/** MF-CON-09 — production API runtime must not statically import @epis2/test-fixtures. */
export async function validate() {
  const errors = [];

  const apiPkgPath = join(REPO_ROOT, 'apps/api/package.json');
  const apiPkg = JSON.parse(readFileSync(apiPkgPath, 'utf8'));
  if (apiPkg.dependencies?.['@epis2/test-fixtures']) {
    errors.push(
      'apps/api/package.json: @epis2/test-fixtures debe estar en devDependencies, no dependencies',
    );
  }

  for await (const { rel, content } of walkSourceFiles({ roots: [PROD_API_ROOT] })) {
    if (TEST_FILE.test(rel)) continue;
    if (rel.includes('/fixtures/devFixturesBridge.')) continue;
    if (!content.includes('@epis2/test-fixtures')) continue;
    errors.push(`${rel}: import estático prohibido de @epis2/test-fixtures en runtime prod`);
  }

  return errors.length ? { ok: false, details: errors } : { ok: true };
}
