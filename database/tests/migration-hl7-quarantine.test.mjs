import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('031_hl7_quarantine migration', () => {
  it('define tabla interop_hl7_quarantine', async () => {
    const sql = await readFile(join(migrationsDir, '031_hl7_quarantine.sql'), 'utf8');
    expect(sql).toContain('interop_hl7_quarantine');
    expect(sql).toContain('quarantine');
  });
});
