import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('017_v3_draft_types migration', () => {
  it('amplía CHECK draft_type con MAR y enfermería', async () => {
    const sql = await readFile(join(migrationsDir, '017_v3_draft_types.sql'), 'utf8');
    expect(sql).toContain('medication_administration');
    expect(sql).toContain('nursing_note');
    expect(sql).toContain('pharmacy_validation');
  });
});
