import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { clinicalCaseRecordSchema } from '@epis2/contracts';
import { buildRecordsFromCatalog, loadCatalog } from './catalog.js';
import { filterValidRecords } from '../validate.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(moduleDir, '..', '..', 'fixtures');

describe('clinical-case-intel catalog', () => {
  it('carga manifest con 10 entradas piloto', async () => {
    const catalog = await loadCatalog(join(fixturesDir, 'catalog.json'));
    expect(catalog.entries).toHaveLength(10);
    expect(catalog.entries.some((e) => e.source === 'meded')).toBe(true);
  });

  it('genera 10 registros sintéticos válidos desde catálogo', async () => {
    const { records, failures } = await buildRecordsFromCatalog(fixturesDir, {
      scrapedAt: '2026-06-12T12:00:00.000Z',
    });
    expect(failures).toEqual([]);
    expect(records).toHaveLength(10);
    const codes = new Set(records.map((r) => r.caseCode));
    expect(codes.size).toBe(10);
    const { valid, invalid } = filterValidRecords(records);
    expect(invalid).toHaveLength(0);
    expect(valid).toHaveLength(10);
    for (const record of valid) {
      expect(clinicalCaseRecordSchema.parse(record).tier).toBe('L0_synthetic');
    }
  });
});
