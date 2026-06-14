import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { migrationFileChecksum } from './migration-checksum.mjs';

/** @param {string} root */
export async function loadChileMigrationManifest(root) {
  const raw = await readFile(join(root, 'scripts/db/chile-migrations-checksums.json'), 'utf8');
  return JSON.parse(raw);
}

/**
 * Valida checksums pinneados de migraciones Chile 035–040 (MF-SH-06).
 * @param {string} root
 */
export async function validateChileMigrations(root) {
  const manifest = await loadChileMigrationManifest(root);
  const errors = [];

  if (manifest.controlTable !== 'epis2_schema_migrations') {
    errors.push('manifest: controlTable debe ser epis2_schema_migrations');
  }

  const entries = manifest.migrations ?? [];
  if (entries.length !== 6) {
    errors.push(`manifest: se esperaban 6 migraciones Chile, hay ${entries.length}`);
  }

  for (const entry of entries) {
    const { filename, checksum, schemaVersion } = entry;
    if (!filename || !checksum || !schemaVersion) {
      errors.push(`manifest: entrada incompleta (${filename ?? '?'})`);
      continue;
    }

    let sql;
    try {
      sql = await readFile(join(root, 'database', 'migrations', filename), 'utf8');
    } catch {
      errors.push(`falta migración: ${filename}`);
      continue;
    }

    if (!sql.trim()) {
      errors.push(`migración vacía: ${filename}`);
    }

    const actual = await migrationFileChecksum(root, filename);
    if (actual !== checksum) {
      errors.push(
        `checksum distinto: ${filename} (actual ${actual.slice(0, 12)}… ≠ manifest ${checksum.slice(0, 12)}…)`,
      );
    }

    if (!sql.includes(`version = '${schemaVersion}'`)) {
      errors.push(`${filename} sin epis2_schema_meta version ${schemaVersion}`);
    }
  }

  const sorted = entries.map((e) => e.filename).sort();
  const expectedOrder = [
    '035_chile_patient_identifiers.sql',
    '036_chile_patient_coverage.sql',
    '037_chile_patient_clinical_summary.sql',
    '038_chile_episodes_of_care.sql',
    '039_chile_professionals.sql',
    '040_chile_audit_extend.sql',
  ];
  if (JSON.stringify(sorted) !== JSON.stringify(expectedOrder)) {
    errors.push('manifest: orden/filenames Chile 035–040 incorrecto');
  }

  if (errors.length) {
    throw new Error(`Chile migrations 035–040:\n  - ${errors.join('\n  - ')}`);
  }

  return { count: entries.length, controlTable: manifest.controlTable };
}
