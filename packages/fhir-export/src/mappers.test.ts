import { describe, expect, it } from 'vitest';
import { getDemoCaseByPatientId } from '@epis2/test-fixtures';
import { assertExportClean } from './validateExport.js';
import { findUiOnlyKeys } from './uiForbidden.js';
import {
  bodyToNarrative,
  buildAssistProvenanceExtras,
  buildPatientExportBundle,
  toFhirAllergyIntolerance,
  toFhirAiModelCardDocumentReference,
  toFhirDocumentReference,
  toFhirEncounter,
  toFhirPatient,
  toFhirMedicationRequest,
  toFhirProvenance,
  toFhirServiceRequest,
} from './mappers.js';
import { EPIS2_AIAST_SYSTEM, EPIS2_MODEL_CARD_VERSION } from './constants.js';

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

  it('AllergyIntolerance DEMO-005 valida perfil', () => {
    const demo005 = getDemoCaseByPatientId('a0000001-0000-4000-8000-000000000005')!;
    const allergy = toFhirAllergyIntolerance(
      {
        id: 'al-demo-penicillin',
        patientId: demo005.patientId,
        substance: 'Penicilina',
        severity: 'high',
      },
      true,
    );
    expect(assertExportClean(allergy).ok).toBe(true);
    const bundle = buildPatientExportBundle(
      toFhirPatient({
        id: demo005.patientId,
        displayName: demo005.displayName,
        birthDate: demo005.birthDate,
        sex: demo005.sex,
        isSynthetic: true,
        demoIdentifier: demo005.demoCaseCode,
      }),
      [],
      [],
      [],
      [allergy],
    );
    const hasAllergy = (bundle.entry ?? []).some(
      (e) => (e.resource as { resourceType?: string }).resourceType === 'AllergyIntolerance',
    );
    expect(hasAllergy).toBe(true);
  });

  it('MedicationRequest solo desde prescription (MF-CHILE-RX-01)', () => {
    const mr = toFhirMedicationRequest(
      {
        id: 'rx-demo-001',
        patientId: demo.patientId,
        draftType: 'prescription',
        body: {
          medication: 'Losartán',
          dose: '50 mg',
          quantity: '30 comprimidos',
          route: 'oral',
          frequency: '1 vez al día',
          duration: '30 días',
          patientInstructions: 'Tomar con agua',
        },
      },
      true,
    );
    expect(mr).not.toBeNull();
    expect(mr?.resourceType).toBe('MedicationRequest');
    expect(mr?.status).toBe('draft');
    expect(assertExportClean(mr).ok).toBe(true);

    const skip = toFhirMedicationRequest(
      {
        id: 'rx-demo-002',
        patientId: demo.patientId,
        draftType: 'evolution_note',
        body: { medication: 'No debe exportar' },
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

  it('DocumentReference con aiProvenance lleva tag AIAST (MF-IM-06)', () => {
    const noteId = 'c0000001-0000-4000-8000-000000000099';
    const aiProvenance = {
      aiRunId: 'f0000001-0000-4000-8000-000000000001',
      blueprintId: 'evolution_note',
      model: 'llama3.2:3b',
      promptHash: 'abc123',
    };
    const doc = toFhirDocumentReference(
      {
        id: noteId,
        patientId: demo.patientId,
        noteType: 'evolution_note',
        title: 'Evolución asistida (demo)',
        body: { subjective: 'Mejoría', plan: 'Control' },
        createdAt: new Date('2026-01-15T10:00:00.000Z'),
      },
      true,
      { aiProvenance },
    );
    const aiastTag = doc.meta.tag?.find((t) => t.code === 'AIAST');
    expect(aiastTag?.system).toBe(EPIS2_AIAST_SYSTEM);
    expect(assertExportClean(doc).ok).toBe(true);
  });

  it('bundle incluye Provenance + Device + model card cuando aiProvenance (MF-IM-06/07)', () => {
    const noteId = 'c0000001-0000-4000-8000-000000000099';
    const approvedAt = new Date('2026-01-15T11:00:00.000Z');
    const aiProvenance = {
      aiRunId: 'f0000001-0000-4000-8000-000000000001',
      blueprintId: 'evolution_note',
      model: 'llama3.2:3b',
      promptHash: 'abc123',
    };
    const patient = toFhirPatient({
      id: demo.patientId,
      displayName: demo.displayName,
      birthDate: demo.birthDate,
      sex: demo.sex,
      isSynthetic: true,
      demoIdentifier: demo.demoCaseCode,
    });
    const doc = toFhirDocumentReference(
      {
        id: noteId,
        patientId: demo.patientId,
        noteType: 'evolution_note',
        title: 'Evolución asistida (demo)',
        body: { subjective: 'Mejoría' },
        createdAt: new Date('2026-01-15T10:00:00.000Z'),
      },
      true,
      { aiProvenance },
    );
    const extras = buildAssistProvenanceExtras({
      noteId,
      patientId: demo.patientId,
      aiProvenance,
      approvedAt,
    });
    const bundle = buildPatientExportBundle(patient, [], [doc], [], extras);
    const types = (bundle.entry ?? []).map(
      (e) => (e.resource as { resourceType?: string }).resourceType,
    );
    expect(types).toContain('Provenance');
    expect(types).toContain('Device');
    expect(types).toContain('DocumentReference');
    const modelCardEntries = (bundle.entry ?? []).filter(
      (e) =>
        (e.resource as { resourceType?: string; type?: { text?: string } }).resourceType ===
          'DocumentReference' &&
        (e.resource as { type?: { text?: string } }).type?.text === 'Model Card IA EPIS2',
    );
    expect(modelCardEntries.length).toBe(1);

    const prov = toFhirProvenance(
      {
        noteId,
        patientId: demo.patientId,
        aiProvenance,
        approvedAt,
      },
      'epis2-ai-model-card-llama3-2-3b',
    );
    expect(prov.target?.[0]?.reference).toBe(`DocumentReference/${noteId}`);
    expect(prov.agent?.[0]?.who?.reference).toContain('Device/ai-device-');
    expect(prov.entity?.some((e) => e.role === 'derivation')).toBe(true);
    expect(assertExportClean(bundle).ok).toBe(true);
  });

  it('model card DocumentReference valida y round-trip markdown (MF-IM-07)', () => {
    const aiProvenance = {
      aiRunId: 'f0000001-0000-4000-8000-000000000001',
      blueprintId: 'evolution_note',
      model: 'llama3.2:3b',
      promptHash: 'abc123def456',
    };
    const modelCard = toFhirAiModelCardDocumentReference({
      model: aiProvenance.model,
      promptHash: aiProvenance.promptHash,
      blueprintId: aiProvenance.blueprintId,
      cardVersion: EPIS2_MODEL_CARD_VERSION,
    });
    expect(modelCard.id).toBe('epis2-ai-model-card-llama3-2-3b');
    expect(modelCard.content[0]?.attachment.contentType).toBe('text/markdown');
    expect(assertExportClean(modelCard).ok).toBe(true);

    const data = modelCard.content[0]?.attachment.data ?? '';
    const decoded = Buffer.from(data, 'base64').toString('utf8');
    expect(decoded).toContain('llama3.2:3b');
    expect(decoded).toContain('abc123def456');
    expect(decoded).toContain('evolution_note');
    expect(decoded).toContain(EPIS2_MODEL_CARD_VERSION);
  });
});
