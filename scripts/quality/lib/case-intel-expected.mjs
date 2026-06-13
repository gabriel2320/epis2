import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
export const MIN_SIM_CATALOG = 10;

export function readExpectedSimCatalogSize() {
  const catalogPath = join(root, 'services/clinical-case-intel/fixtures/catalog.json');
  if (!existsSync(catalogPath)) {
    throw new Error('falta fixtures/catalog.json');
  }
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const count = catalog.entries?.length ?? 0;
  if (count < MIN_SIM_CATALOG) {
    throw new Error(`catalog.json debe tener >= ${MIN_SIM_CATALOG} entries (actual: ${count})`);
  }
  return count;
}
