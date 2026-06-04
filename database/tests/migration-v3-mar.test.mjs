import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('014_v3_mar_records migration', () => {
  it('define tabla mar_administration_records', async () => {
    const sql = await readFile(join(migrationsDir, '014_v3_mar_records.sql'), 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS mar_administration_records');
  });
});
