import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('031_hl7_quarantine migration (MF-IC-04 hardening)', () => {
  let sql;

  it('carga migración 031', async () => {
    sql = await readFile(join(migrationsDir, '031_hl7_quarantine.sql'), 'utf8');
    expect(sql).toContain('interop_hl7_quarantine');
  });

  it('define tabla con status acotado y sin writeback directo a clinical_notes', async () => {
    sql ??= await readFile(join(migrationsDir, '031_hl7_quarantine.sql'), 'utf8');
    expect(sql).toContain('quarantine');
    expect(sql).toContain(
      "CHECK (status IN ('quarantine', 'mapped', 'writeback_proposed', 'reverted', 'rejected'))",
    );
    expect(sql).not.toMatch(/INSERT\s+INTO\s+clinical_notes/i);
    expect(sql).toContain('REFERENCES clinical_drafts(id)');
  });

  it('indexa status + staged_at para listado ops', async () => {
    sql ??= await readFile(join(migrationsDir, '031_hl7_quarantine.sql'), 'utf8');
    expect(sql).toContain('idx_hl7_quarantine_status');
    expect(sql).toContain('staged_at DESC');
  });

  it('referencia runbook MF-IC-04', async () => {
    sql ??= await readFile(join(migrationsDir, '031_hl7_quarantine.sql'), 'utf8');
    expect(sql).toContain('HL7_INTEROP_INGESTION_RUNBOOK.md');
  });
});
