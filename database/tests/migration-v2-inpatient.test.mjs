import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('010_v2_inpatient migration', () => {
  it('define censo, camas y resultados críticos', async () => {
    const sql = await readFile(join(migrationsDir, '010_v2_inpatient.sql'), 'utf8');
    for (const table of [
      'clinical_units',
      'beds',
      'inpatient_admissions',
      'clinical_critical_results',
    ]) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
    expect(sql).toContain('epis2-v2-inpatient');
  });
});

describe('011_v2_inpatient_seed migration', () => {
  it('siembra unidad cirugía y crítico INR DEMO-005', async () => {
    const sql = await readFile(join(migrationsDir, '011_v2_inpatient_seed.sql'), 'utf8');
    expect(sql).toContain('CIRUGIA-DEMO');
    expect(sql).toContain('a0000001-0000-4000-8000-000000000004');
    expect(sql).toContain('a0000001-0000-4000-8000-000000000005');
    expect(sql).toContain('INR');
  });
});
