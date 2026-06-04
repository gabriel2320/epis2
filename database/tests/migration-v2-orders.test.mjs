import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('012_v2_clinical_orders migration', () => {
  it('define tabla clinical_orders', async () => {
    const sql = await readFile(join(migrationsDir, '012_v2_clinical_orders.sql'), 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS clinical_orders');
  });
});
