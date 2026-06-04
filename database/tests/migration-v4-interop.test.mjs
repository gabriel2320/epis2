import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('015_v4_interop_staging migration', () => {
  it('define tabla interop_staging_batches', async () => {
    const sql = await readFile(join(migrationsDir, '015_v4_interop_staging.sql'), 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS interop_staging_batches');
  });
});

describe('016_v4_interop_staging_seed migration', () => {
  it('siembra lotes HL7 y FHIR demo', async () => {
    const sql = await readFile(join(migrationsDir, '016_v4_interop_staging_seed.sql'), 'utf8');
    expect(sql).toContain('interop_staging_batches');
    expect(sql).toContain('HL7v2-ADT');
    expect(sql).toContain('FHIR-Bundle');
  });
});
