import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sql = readFileSync(join(root, 'migrations', '018_demo005_chart_seed.sql'), 'utf8');

describe('migration 018 demo005 chart seed', () => {
  it('siembra INR y frecuencia cardiaca para DEMO-005', () => {
    expect(sql).toContain('a0000001-0000-4000-8000-000000000005');
    expect(sql).toContain("'INR'");
    expect(sql).toContain('Frecuencia cardiaca');
  });
});
