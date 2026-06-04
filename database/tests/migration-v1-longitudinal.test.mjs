import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('008_v1_longitudinal migration', () => {
  it('define tablas alergias, medicación y documentos clínicos', async () => {
    const sql = await readFile(join(migrationsDir, '008_v1_longitudinal.sql'), 'utf8');
    for (const table of ['patient_allergies', 'patient_medications', 'clinical_documents']) {
      expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
    expect(sql).toContain('epis2-v1-longitudinal');
  });
});

describe('009_v1_longitudinal_seed migration', () => {
  it('siembra alergia penicilina DEMO-005 y medicamentos demo', async () => {
    const sql = await readFile(join(migrationsDir, '009_v1_longitudinal_seed.sql'), 'utf8');
    expect(sql).toContain('Penicilina');
    expect(sql).toContain('a0000001-0000-4000-8000-000000000005');
    expect(sql).toContain('patient_medications');
    expect(sql).toContain('clinical_documents');
  });
});
