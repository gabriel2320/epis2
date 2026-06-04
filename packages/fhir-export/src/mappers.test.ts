import { describe, expect, it } from 'vitest';
import { getDemoCaseByPatientId } from '@epis2/test-fixtures';
import { assertExportClean } from './validateExport.js';
import { findUiOnlyKeys } from './uiForbidden.js';
import {
  bodyToNarrative,
  buildPatientExportBundle,
  toFhirDocumentReference,
  toFhirEncounter,
  toFhirPatient,
  toFhirServiceRequest,
} from './mappers.js';

describe('FHIR export mappers (EPIS2-10)', () => {
  const demo = getDemoCaseByPatientId('a0000001-0000-4000-8000-000000000001')!;

  it('exporta Patient sin claves de UI', () => {
    const patient = toFhirPatient({
      id: demo.patientId,
      displayName: demo.displayName,
      birthDate: demo.birthDate,
      sex: demo.sex,
      isSynthetic: true,
      demoIdentifier: demo.demoCaseCode,
    });
    expect(assertExportClean(patient).ok).toBe(true);
    expect(patient.meta.tag?.[0]?.code).toBe('synthetic');
    expect(findUiOnlyKeys(patient)).toEqual([]);
  });

  it('narrativa de nota no repite campos de resumen UI', () => {
    const narrative = bodyToNarrative({
      subjective: 'Mejoría (demo)',
      assessment: 'HTA controlada',
      activeProblems: 'NO DEBE APARECER',
    });
    expect(narrative).not.toContain('activeProblems');
    expect(narrative).toContain('SUBJECTIVE');
  });

  it('DocumentReference valida perfil mínimo', () => {
    const doc = toFhirDocumentReference(
      {
        id: 'c0000001-0000-4000-8000-000000000001',
        patientId: demo.patientId,
        noteType: 'evolution_note',
        title: 'Evolución (demo)',
        body: { subjective: 'Sin dolor', plan: 'Control' },
        createdAt: new Date('2026-01-15T10:00:00.000Z'),
      },
      true,
    );
    expect(assertExportClean(doc).ok).toBe(true);
  });

  it('ServiceRequest solo desde lab_request', () => {
    const sr = toFhirServiceRequest(
      {
        id: 'd0000001-0000-4000-8000-000000000001',
        patientId: demo.patientId,
        draftType: 'lab_request',
        title: 'Laboratorio demo',
        body: { labTests: 'Hemograma', clinicalReason: 'Control', priority: 'rutina' },
      },
      true,
    );
    expect(sr).not.toBeNull();
    expect(assertExportClean(sr).ok).toBe(true);

    const skip = toFhirServiceRequest(
      {
        id: 'd0000001-0000-4000-8000-000000000002',
        patientId: demo.patientId,
        draftType: 'evolution_note',
        title: 'No lab',
        body: {},
      },
      true,
    );
    expect(skip).toBeNull();
  });

  it('bundle de paciente valida y no contiene UI-only', () => {
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
    const bundle = buildPatientExportBundle(patient, [enc], [], []);
    expect(assertExportClean(bundle).ok).toBe(true);
  });
});
