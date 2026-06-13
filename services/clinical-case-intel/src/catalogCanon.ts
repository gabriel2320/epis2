import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Mínimo histórico MF-CASE-06; el catálogo puede crecer (MF-CASE-09+). */
export const MIN_SIM_CATALOG = 10;

export function catalogFixturesDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');
}

export function readCatalogEntryCount(fixturesDir = catalogFixturesDir()): number {
  const raw = readFileSync(join(fixturesDir, 'catalog.json'), 'utf8');
  const catalog = JSON.parse(raw) as { entries: unknown[] };
  if (!Array.isArray(catalog.entries) || catalog.entries.length < MIN_SIM_CATALOG) {
    throw new Error(`catalog.json inválido o < ${MIN_SIM_CATALOG} entradas`);
  }
  return catalog.entries.length;
}
