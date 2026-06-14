import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('044_user_operational_memory migration', () => {
  it('crea tabla con RLS por usuario', async () => {
    const sql = await readFile(join(migrationsDir, '044_user_operational_memory.sql'), 'utf8');
    expect(sql).toContain('user_operational_memory');
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('user_operational_memory_rls_enforce');
    expect(sql).toContain("version = 'user-operational-memory'");
  });
});
