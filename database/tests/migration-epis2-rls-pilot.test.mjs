import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('022_epis2_rls_pilot migration', () => {
  it('habilita RLS en tablas clínicas con políticas off/enforce', async () => {
    const sql = await readFile(join(migrationsDir, '022_epis2_rls_pilot.sql'), 'utf8');
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('clinical_drafts_rls_off');
    expect(sql).toContain('clinical_drafts_rls_enforce');
    expect(sql).toContain('epis2.rls_mode');
    expect(sql).toContain("version = 'epis2-rls-pilot'");
  });
});
