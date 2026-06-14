import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { migrationFileChecksum } from '../../scripts/db/migration-checksum.mjs';
import {
  loadChileMigrationManifest,
  validateChileMigrations,
} from '../../scripts/db/validate-chile-migrations.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const migrationsDir = join(root, 'database', 'migrations');

describe('MF-SH-06 — control migraciones Chile 035–040', () => {
  it('manifest pinnea 6 checksums contra epis2_schema_migrations', async () => {
    const manifest = await loadChileMigrationManifest(root);
    expect(manifest.controlTable).toBe('epis2_schema_migrations');
    expect(manifest.migrations).toHaveLength(6);
    await expect(validateChileMigrations(root)).resolves.toMatchObject({ count: 6 });
  });

  it('035 identificadores RUN + columnas RUT', async () => {
    const sql = await readFile(join(migrationsDir, '035_chile_patient_identifiers.sql'), 'utf8');
    expect(sql).toContain('patient_identifiers');
    expect(sql).toContain('rut_numero');
    expect(sql).toContain("version = 'epis2-chile-id-01'");
  });

  it('036 patient_coverage previsión Chile', async () => {
    const sql = await readFile(join(migrationsDir, '036_chile_patient_coverage.sql'), 'utf8');
    expect(sql).toContain('patient_coverage');
    expect(sql).toContain('tipo_prevision');
  });

  it('037 vista patient_clinical_summary', async () => {
    const sql = await readFile(join(migrationsDir, '037_chile_patient_clinical_summary.sql'), 'utf8');
    expect(sql).toContain('patient_clinical_summary');
  });

  it('038 episodes_of_care + FK encounter', async () => {
    const sql = await readFile(join(migrationsDir, '038_chile_episodes_of_care.sql'), 'utf8');
    expect(sql).toContain('episodes_of_care');
    expect(sql).toContain('episode_id');
  });

  it('039 professionals RNPI stub', async () => {
    const sql = await readFile(join(migrationsDir, '039_chile_professionals.sql'), 'utf8');
    expect(sql).toContain('professionals');
    expect(sql).toContain('rnpi_numero');
  });

  it('040 audit_events extendido', async () => {
    const sql = await readFile(join(migrationsDir, '040_chile_audit_extend.sql'), 'utf8');
    expect(sql).toContain('audit_events');
    expect(sql).toContain('patient_id');
  });

  it('checksum estable para 035 (regresión CRLF)', async () => {
    const sum = await migrationFileChecksum(root, '035_chile_patient_identifiers.sql');
    expect(sum).toBe('96ad2786a503abcfac353a1303052afcb22dae2336725848b03d9e9fd19b12e5');
  });
});
