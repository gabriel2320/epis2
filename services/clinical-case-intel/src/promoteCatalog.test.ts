import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SIM_CLINICAL_CASES } from '@epis2/test-fixtures';
import { buildRecordsFromCatalog } from './sources/catalog.js';
import { filterValidRecords } from './validate.js';
import { EXPECTED_SIM_CATALOG_SIZE } from './promoteCatalog.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(moduleDir, '..', 'fixtures');

describe('clinical-case-intel promoteCatalog', () => {
  it('catálogo alinea caseCodes con SIM_CLINICAL_CASES', async () => {
    const { records } = await buildRecordsFromCatalog(fixturesDir, {
      scrapedAt: '2026-06-12T12:00:00.000Z',
    });
    const { valid } = filterValidRecords(records);
    expect(valid).toHaveLength(EXPECTED_SIM_CATALOG_SIZE);
    const fixtureCodes = new Set(SIM_CLINICAL_CASES.map((c) => c.demoCaseCode));
    for (const record of valid) {
      expect(fixtureCodes.has(record.caseCode)).toBe(true);
    }
  });
});
