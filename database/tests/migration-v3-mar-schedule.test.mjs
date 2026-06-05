import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('021_v3_mar_schedule migration', () => {
  it('define tabla mar_scheduled_doses con ventanas y seed demo', async () => {
    const sql = await readFile(join(migrationsDir, '021_v3_mar_schedule.sql'), 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS mar_scheduled_doses');
    expect(sql).toContain('window_start');
    expect(sql).toContain('requires_double_check');
    expect(sql).toContain('a0000001-0000-4000-8000-000000000005');
    expect(sql).toContain("version = 'epis2-v3-mar-schedule'");
  });
});
