import {
  assertExportClean,
  buildPatientExportBundle,
  toFhirAllergyIntolerance,
  toFhirDocumentReference,
  toFhirEncounter,
  toFhirMedicationStatement,
  toFhirPatient,
  toFhirServiceRequest,
} from '@epis2/fhir-export';
import { DEMO_IDENTIFIER_SYSTEM } from '@epis2/test-fixtures';
import { and, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  clinicalDrafts,
  clinicalNotes,
  encounters,
  patientAllergies,
  patientMedications,
} from '../db/schema.js';
import { getPatientById, getPatientDemoCaseCode, listApprovedNotes } from '../clinical/service.js';

export class FhirExportError extends Error {
  constructor(
    message: string,
    readonly code: 'NOT_FOUND' | 'UNSUPPORTED' | 'VALIDATION',
  ) {
    super(message);
    this.name = 'FhirExportError';
  }
}

function ensureValid(resource: unknown) {
  const check = assertExportClean(resource);
  if (!check.ok) {
    throw new FhirExportError(
      `Export FHIR inválido: ${JSON.stringify(check.uiOnlyKeys ?? check.profileErrors)}`,
      'VALIDATION',
    );
  }
}

export async function exportFhirPatient(db: Database, patientId: string) {
  const patient = await getPatientById(db, patientId);
  if (!patient) throw new FhirExportError('Paciente no encontrado', 'NOT_FOUND');
  const demoCaseCode = await getPatientDemoCaseCode(db, patientId);
  const patientSource: Parameters<typeof toFhirPatient>[0] = {
    id: patient.id,
    displayName: patient.displayName,
    birthDate: patient.birthDate,
    sex: patient.sex,
    isSynthetic: patient.isSynthetic,
  };
  if (demoCaseCode !== undefined) patientSource.demoIdentifier = demoCaseCode;
  const resource = toFhirPatient(patientSource);
  ensureValid(resource);
  return resource;
}

export async function exportFhirEncounter(db: Database, encounterId: string) {
  const [enc] = await db.select().from(encounters).where(eq(encounters.id, encounterId)).limit(1);
  if (!enc) throw new FhirExportError('Encuentro no encontrado', 'NOT_FOUND');
  const resource = toFhirEncounter({
    id: enc.id,
    patientId: enc.patientId,
    status: enc.status,
  });
  ensureValid(resource);
  return resource;
}

export async function exportFhirDocumentReference(db: Database, noteId: string) {
  const [note] = await db.select().from(clinicalNotes).where(eq(clinicalNotes.id, noteId)).limit(1);
  if (!note) throw new FhirExportError('Nota no encontrada', 'NOT_FOUND');
  const patient = await getPatientById(db, note.patientId);
  const resource = toFhirDocumentReference(
    {
      id: note.id,
      patientId: note.patientId,
      noteType: note.noteType,
      title: note.title,
      body: note.body as Record<string, unknown>,
      createdAt: note.createdAt,
    },
    patient?.isSynthetic ?? true,
  );
  ensureValid(resource);
  return resource;
}

export async function exportFhirServiceRequest(db: Database, draftId: string) {
  const [draft] = await db
    .select()
    .from(clinicalDrafts)
    .where(eq(clinicalDrafts.id, draftId))
    .limit(1);
  if (!draft) throw new FhirExportError('Borrador no encontrado', 'NOT_FOUND');
  const patient = await getPatientById(db, draft.patientId);
  const resource = toFhirServiceRequest(
    {
      id: draft.id,
      patientId: draft.patientId,
      draftType: draft.draftType,
      title: draft.title,
      body: draft.body as Record<string, unknown>,
    },
    patient?.isSynthetic ?? true,
  );
  if (!resource) {
    throw new FhirExportError('Solo borradores lab_request exportan ServiceRequest', 'UNSUPPORTED');
  }
  ensureValid(resource);
  return resource;
}

export async function exportFhirPatientBundle(db: Database, patientId: string) {
  const patient = await getPatientById(db, patientId);
  if (!patient) throw new FhirExportError('Paciente no encontrado', 'NOT_FOUND');
  const demoCaseCode = await getPatientDemoCaseCode(db, patientId);

  const patientSource: Parameters<typeof toFhirPatient>[0] = {
    id: patient.id,
    displayName: patient.displayName,
    birthDate: patient.birthDate,
    sex: patient.sex,
    isSynthetic: patient.isSynthetic,
  };
  if (demoCaseCode !== undefined) patientSource.demoIdentifier = demoCaseCode;
  const patientResource = toFhirPatient(patientSource);

  const encRows = await db.select().from(encounters).where(eq(encounters.patientId, patientId));
  const encounterResources = encRows.map((enc) =>
    toFhirEncounter({ id: enc.id, patientId: enc.patientId, status: enc.status }),
  );

  const notes = await listApprovedNotes(db, patientId);
  const documentResources = notes.map((note) =>
    toFhirDocumentReference(
      {
        id: note.id,
        patientId: note.patientId,
        noteType: note.noteType,
        title: note.title,
        body: note.body as Record<string, unknown>,
        createdAt: note.createdAt,
      },
      patient.isSynthetic,
    ),
  );

  const draftRows = await db
    .select()
    .from(clinicalDrafts)
    .where(
      and(eq(clinicalDrafts.patientId, patientId), eq(clinicalDrafts.draftType, 'lab_request')),
    );
  const serviceRequests = draftRows
    .map((draft) =>
      toFhirServiceRequest(
        {
          id: draft.id,
          patientId: draft.patientId,
          draftType: draft.draftType,
          title: draft.title,
          body: draft.body as Record<string, unknown>,
        },
        patient.isSynthetic,
      ),
    )
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const allergyRows = await db
    .select()
    .from(patientAllergies)
    .where(eq(patientAllergies.patientId, patientId));
  const medRows = await db
    .select()
    .from(patientMedications)
    .where(eq(patientMedications.patientId, patientId));

  const longitudinalExtras = [
    ...allergyRows.map((a) =>
      toFhirAllergyIntolerance(
        {
          id: a.id,
          patientId: a.patientId,
          substance: a.substance,
          severity: a.severity,
        },
        patient.isSynthetic,
      ),
    ),
    ...medRows.map((m) =>
      toFhirMedicationStatement(
        {
          id: m.id,
          patientId: m.patientId,
          name: m.name,
          doseText: m.doseText,
          status: m.status,
        },
        patient.isSynthetic,
      ),
    ),
  ] as Record<string, unknown>[];

  const bundle = buildPatientExportBundle(
    patientResource,
    encounterResources,
    documentResources,
    serviceRequests,
    longitudinalExtras,
  );
  ensureValid(bundle);
  return bundle;
}

/** Estado de frontera FHIR (import diferido en v1). */
export const FHIR_BOUNDARY = {
  exportEnabled: true,
  importEnabled: false,
  identifierSystem: DEMO_IDENTIFIER_SYSTEM,
} as const;
