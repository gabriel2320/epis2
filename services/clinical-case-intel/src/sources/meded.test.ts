import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildRecordsFromTeachingCase } from './meded.js';
import { filterValidRecords } from '../validate.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(moduleDir, '..', '..', 'fixtures', 'meded-asthma-teaching.json');

describe('clinical-case-intel meded', () => {
  it('normaliza TeachingCase a registro SIM con provenance meded-portal', async () => {
    const raw = await readFile(fixturePath, 'utf8');
    const records = buildRecordsFromTeachingCase(JSON.parse(raw) as unknown, {
      scrapedAt: '2026-06-12T12:00:00.000Z',
      sourceUrl: fixturePath,
    });
    expect(records).toHaveLength(1);
    const record = records[0]!;
    expect(record.caseCode).toMatch(/^SIM-/);
    expect(record.provenance.sourceName).toBe('meded-portal');
    expect(record.clinical.problems[0]).toContain('Asma');
    expect(record.patient.displayName).toContain('Paciente Sim');
    const { valid } = filterValidRecords(records);
    expect(valid).toHaveLength(1);
  });
});
