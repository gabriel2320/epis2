import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createHttpClient } from '../http.js';
import { filterValidRecords } from '../validate.js';
import { buildRecordsFromRemoteSources } from './mededRemote.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(moduleDir, '..', '..', 'fixtures');
const manifestPath = join(fixturesDir, 'meded-remote-sources.json');
const cacheDir = join(moduleDir, '..', '..', '.cache-test');

describe('clinical-case-intel mededRemote', () => {
  it('carga manifest fixture: sin red', async () => {
    const http = createHttpClient({ cacheDir });
    const { records, failures } = await buildRecordsFromRemoteSources(manifestPath, {
      scrapedAt: '2026-06-12T12:00:00.000Z',
      fixturesDir,
      http,
    });
    expect(failures).toEqual([]);
    expect(records).toHaveLength(2);
    const { valid } = filterValidRecords(records);
    expect(valid).toHaveLength(2);
    expect(records.some((r) => r.provenance.sourceName === 'pmc-teaching-case')).toBe(true);
  });
});
