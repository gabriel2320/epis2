import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'migrations',
  '003_core_clinical.sql',
);

describe('003_core_clinical migration', () => {
  it('define tablas núcleo y separación borrador/nota', async () => {
    const sql = await readFile(migrationPath, 'utf8');
    for (const table of [
      'clinical_drafts',
      'draft_versions',
      'clinical_notes',
      'clinical_note_versions',
      'approvals',
      'audit_events',
      'patients',
    ]) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
    expect(sql).toContain('created_by');
    const forbidden = ['auto', '_approve'].join('');
    expect(sql.toLowerCase()).not.toContain(forbidden);
  });
});
