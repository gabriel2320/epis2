import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'migrations',
  '006_demo_five_cases.sql',
);

describe('006_demo_five_cases migration', () => {
  it('siembra 5 pacientes DEMO y marca epis2-09', async () => {
    const sql = await readFile(migrationPath, 'utf8');
    expect(sql).toContain('DEMO-004');
    expect(sql).toContain('DEMO-005');
    expect(sql).toContain('is_synthetic');
    expect(sql).toContain('epis2-09-demo');
    expect(sql).not.toMatch(/\b\d{7,8}[-\s]?\d{1,2}\b/);
  });
});
