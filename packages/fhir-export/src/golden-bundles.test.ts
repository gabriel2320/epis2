import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getDemoCaseByPatientId } from '@epis2/test-fixtures';
import { EPIS2_FHIR_BASE } from './constants.js';
import { buildPatientExportBundle, toFhirEncounter, toFhirPatient } from './mappers.js';
import { assertExportClean } from './validateExport.js';
import { assertValidEpis2ExportBundle, validateEpis2ExportBundle } from './validateExportBundle.js';

const goldenDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '../fixtures/golden',
);

function readGoldenBundle(name: string): unknown {
  return JSON.parse(readFileSync(join(goldenDir, name), 'utf8'));
}

describe('validateEpis2ExportBundle', () => {
  const demo = getDemoCaseByPatientId('a0000001-0000-4000-8000-000000000001')!;

  function buildDemoBundle() {
    const patient = toFhirPatient({
      id: demo.patientId,
      displayName: demo.displayName,
      birthDate: demo.birthDate,
      sex: demo.sex,
      isSynthetic: true,
      demoIdentifier: demo.demoCaseCode,
    });
    const enc = toFhirEncounter({
      id: demo.encounterId,
      patientId: demo.patientId,
      status: 'open',
    });
    return buildPatientExportBundle(patient, [enc], [], []);
  }

  it('acepta bundle mínimo generado por mappers', () => {
    const bundle = buildDemoBundle();
    expect(validateEpis2ExportBundle(bundle)).toEqual([]);
    assertValidEpis2ExportBundle(bundle);
    expect(assertExportClean(bundle).ok).toBe(true);
  });

  it('rechaza terminología LOINC inventada', () => {
    const bundle = structuredClone(buildDemoBundle()) as {
      entry: { fullUrl?: string; resource: Record<string, unknown> }[];
    };
    bundle.entry.push({
      fullUrl: `${EPIS2_FHIR_BASE}/ServiceRequest/fake-lab`,
      resource: {
        resourceType: 'ServiceRequest',
        id: 'fake-lab',
        code: { coding: [{ system: 'http://loinc.org', code: '2345-7' }] },
        subject: { reference: `Patient/${demo.patientId}` },
      },
    });
    const issues = validateEpis2ExportBundle(bundle);
    expect(issues.some((i) => i.message.includes('terminológico'))).toBe(true);
  });

  it('coincide con golden demo-001-patient.bundle.json', () => {
    const generated = buildDemoBundle();
    const golden = readGoldenBundle('demo-001-patient.bundle.json');
    expect(generated).toEqual(golden);
    assertValidEpis2ExportBundle(generated);
  });
});
