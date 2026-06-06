import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('023_epis2_rls_force migration', () => {
  it('fuerza RLS para el owner de tabla', async () => {
    const sql = await readFile(join(migrationsDir, '023_epis2_rls_force.sql'), 'utf8');
    expect(sql).toContain('FORCE ROW LEVEL SECURITY');
    expect(sql).toContain('clinical_drafts');
    expect(sql).toContain("version = 'epis2-rls-force'");
  });
});
