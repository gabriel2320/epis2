import { describe, expect, it } from 'vitest';
import { CHILE_RUT_IDENTIFIER_SYSTEM, MINSAL_PROFILES } from '@epis2/clinical-domain';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { assertExportClean } from './validateExport.js';
import {
  buildMinsalExportBundle,
  toMinsalFhirDocumentReference,
  toMinsalFhirEncounter,
  toMinsalFhirPatient,
  validateMinsalDocumentReferenceResource,
  validateMinsalEncounterResource,
  validateMinsalPatientResource,
} from './minsalExport.js';

const DEMO_RUT: Record<'DEMO-001' | 'DEMO-005', string> = {
  'DEMO-001': '12.345.678-5',
  'DEMO-005': '9.876.543-3',
};

function buildDemoMinsalBundle(demoCaseCode: 'DEMO-001' | 'DEMO-005') {
  const demo = getDemoCaseByCode(demoCaseCode)!;
  const rut = DEMO_RUT[demoCaseCode];
  const patient = toMinsalFhirPatient({
    id: demo.patientId,
    displayName: demo.displayName,
    birthDate: demo.birthDate,
    sex: demo.sex,
    isSynthetic: true,
    demoIdentifier: demo.demoCaseCode,
    rut,
    identifierType: 'RUN',
  });
  const encounter = toMinsalFhirEncounter({
    id: demo.encounterId,
    patientId: demo.patientId,
    status: 'open',
  });
  const document = toMinsalFhirDocumentReference(
    {
      id: `doc-minsal-${demo.demoCaseCode}`,
      patientId: demo.patientId,
      noteType: 'evolution_note',
      title: `Evolución MINSAL ${demo.demoCaseCode}`,
      body: { subjective: 'Control demo', plan: 'Seguimiento' },
      createdAt: new Date('2026-01-15T10:00:00.000Z'),
    },
    true,
  );
  return buildMinsalExportBundle(patient, [encounter], [document]);
}

describe('MINSAL export (MF-IC-01)', () => {
  it('round-trip DEMO-001 con RUN sintético', () => {
    const demo = getDemoCaseByCode('DEMO-001')!;
    const patient = toMinsalFhirPatient({
      id: demo.patientId,
      displayName: demo.displayName,
      birthDate: demo.birthDate,
      sex: demo.sex,
      isSynthetic: true,
      demoIdentifier: demo.demoCaseCode,
      rut: DEMO_RUT['DEMO-001'],
      identifierType: 'RUN',
    });

    expect(validateMinsalPatientResource(patient).ok).toBe(true);
    expect(patient.meta.profile).toContain(MINSAL_PROFILES.patient);

    const runIdentifier = patient.identifier.find((i) => i.system === CHILE_RUT_IDENTIFIER_SYSTEM);
    expect(runIdentifier?.value).toBe('12.345.678-5');
    expect(assertExportClean(patient).ok).toBe(true);
  });

  it('round-trip DEMO-005 con RUN sintético', () => {
    const demo = getDemoCaseByCode('DEMO-005')!;
    const patient = toMinsalFhirPatient({
      id: demo.patientId,
      displayName: demo.displayName,
      birthDate: demo.birthDate,
      sex: demo.sex,
      isSynthetic: true,
      demoIdentifier: demo.demoCaseCode,
      rut: DEMO_RUT['DEMO-005'],
      identifierType: 'RUN',
    });

    expect(validateMinsalPatientResource(patient).ok).toBe(true);
    const runIdentifier = patient.identifier.find((i) => i.system === CHILE_RUT_IDENTIFIER_SYSTEM);
    expect(runIdentifier?.value).toBe('9.876.543-3');
    expect(assertExportClean(patient).ok).toBe(true);
  });

  it('bundle MINSAL valida perfiles Patient, Encounter y DocumentReference', () => {
    const bundle001 = buildDemoMinsalBundle('DEMO-001');
    const bundle005 = buildDemoMinsalBundle('DEMO-005');

    for (const bundle of [bundle001, bundle005]) {
      expect(bundle.meta.profile).toContain(MINSAL_PROFILES.bundle);

      const resources = (bundle.entry ?? []).map((e) => e.resource);
      const patient = resources.find(
        (r) => (r as { resourceType?: string }).resourceType === 'Patient',
      );
      const encounter = resources.find(
        (r) => (r as { resourceType?: string }).resourceType === 'Encounter',
      );
      const document = resources.find(
        (r) => (r as { resourceType?: string }).resourceType === 'DocumentReference',
      );

      expect(validateMinsalPatientResource(patient).ok).toBe(true);
      expect(validateMinsalEncounterResource(encounter).ok).toBe(true);
      expect(validateMinsalDocumentReferenceResource(document).ok).toBe(true);
    }
  });

  it('assertExportClean pasa en bundle MINSAL completo', () => {
    const bundle = buildDemoMinsalBundle('DEMO-001');
    expect(assertExportClean(bundle).ok).toBe(true);
  });
});
