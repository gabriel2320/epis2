import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('migration 007 demo RUT', () => {
  it('define identificadores RUT sintéticos para los 5 pacientes demo', () => {
    const sql = readFileSync(join(root, 'migrations', '007_demo_rut_identifiers.sql'), 'utf8');
    expect(sql).toContain('http://epis2.cl/identifier/rut');
    expect(sql).toContain('12.345.678-5');
    expect(sql.match(/a0000001-0000-4000-8000-00000000000/g)?.length).toBe(5);
  });
});
