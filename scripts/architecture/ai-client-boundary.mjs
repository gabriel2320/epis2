import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** MF-FF-11 — frontera @epis2/ai-client. */
export async function validate() {
  const errors = [];
  const pkgPath = join(root, 'packages/ai-client/package.json');
  if (!existsSync(pkgPath)) {
    return { ok: false, details: ['Falta packages/ai-client'] };
  }
  const aiApi = readFileSync(join(root, 'apps/web/src/api/aiApi.ts'), 'utf8');
  if (!aiApi.includes('@epis2/ai-client/http')) {
    errors.push('aiApi.ts debe usar @epis2/ai-client/http');
  }
  return errors.length ? { ok: false, details: errors } : { ok: true };
}
