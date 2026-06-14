import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { buildRecordsFromBundle } from './synthea.js';
import { buildRecordsFromTeachingCase } from './meded.js';

export type CatalogEntry = {
  id: string;
  source: 'synthea' | 'meded';
  file: string;
  label: string;
};

export type ClinicalCaseCatalog = {
  version: number;
  description?: string;
  entries: CatalogEntry[];
};

export type CatalogBuildOptions = {
  scrapedAt: string;
  limit?: number;
};

export async function loadCatalog(manifestPath: string): Promise<ClinicalCaseCatalog> {
  const raw = await readFile(manifestPath, 'utf8');
  const parsed = JSON.parse(raw) as ClinicalCaseCatalog;
  if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
    throw new Error('catalog.json sin entries[]');
  }
  return parsed;
}

export async function buildRecordsFromCatalog(
  fixturesDir: string,
  options: CatalogBuildOptions,
): Promise<{ records: ClinicalCaseRecord[]; failures: string[] }> {
  const manifestPath = join(fixturesDir, 'catalog.json');
  const catalog = await loadCatalog(manifestPath);
  const failures: string[] = [];
  const records: ClinicalCaseRecord[] = [];
  const limit = options.limit ?? catalog.entries.length;

  for (const entry of catalog.entries.slice(0, limit)) {
    const filePath = join(fixturesDir, entry.file);
    try {
      const raw = await readFile(filePath, 'utf8');
      const payload = JSON.parse(raw) as unknown;
      if (entry.source === 'meded') {
        records.push(
          ...buildRecordsFromTeachingCase(payload, {
            scrapedAt: options.scrapedAt,
            sourceUrl: filePath,
          }),
        );
      } else {
        records.push(
          ...buildRecordsFromBundle(payload, {
            scrapedAt: options.scrapedAt,
            sourceUrl: filePath,
          }),
        );
      }
    } catch (err) {
      failures.push(`${entry.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { records, failures };
}
