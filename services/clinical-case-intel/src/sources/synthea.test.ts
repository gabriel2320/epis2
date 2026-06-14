import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { clinicalCaseRecordSchema } from '@epis2/contracts';
import { buildRecordsFromBundle, parseFhirBundle } from './synthea.js';
import { filterValidRecords } from '../validate.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(moduleDir, '..', '..', 'fixtures', 'synthea-hypertension.bundle.json');

describe('clinical-case-intel synthea', () => {
  it('parsea bundle FHIR con paciente, condición y observación', async () => {
    const raw = await readFile(fixturePath, 'utf8');
    const bundle = JSON.parse(raw) as unknown;
    const patients = parseFhirBundle(bundle);
    expect(patients).toHaveLength(1);
    expect(patients[0]?.problems[0]).toContain('Hipertensión');
    expect(patients[0]?.observations.length).toBeGreaterThan(0);
    expect(patients[0]?.medications[0]?.name).toContain('Losartan');
  });

  it('normaliza a ClinicalCaseRecord sintético en español', async () => {
    const raw = await readFile(fixturePath, 'utf8');
    const records = buildRecordsFromBundle(JSON.parse(raw) as unknown, {
      scrapedAt: '2026-06-12T12:00:00.000Z',
      sourceUrl: fixturePath,
    });
    expect(records).toHaveLength(1);
    const record = clinicalCaseRecordSchema.parse(records[0]);
    expect(record.caseCode).toMatch(/^SIM-/);
    expect(record.patient.isSynthetic).toBe(true);
    expect(record.patient.displayName).toContain('Paciente Sim');
    expect(record.tier).toBe('L0_synthetic');
    expect(record.generation.requiresHumanReview).toBe(true);
    expect(record.epis2Mapping.identifierSystem).toBe('EPIS2-SIM');
    expect(record.evolabHints?.capabilities).toContain('evolution_note');
  });

  it('pasa validación anti-PHI y marcas sintéticas', async () => {
    const raw = await readFile(fixturePath, 'utf8');
    const records = buildRecordsFromBundle(JSON.parse(raw) as unknown, {
      scrapedAt: '2026-06-12T12:00:00.000Z',
    });
    const { valid, invalid } = filterValidRecords(records);
    expect(invalid).toHaveLength(0);
    expect(valid).toHaveLength(1);
  });
});
