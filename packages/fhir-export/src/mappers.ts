import {
  EPIS2_DATA_ORIGIN_SYSTEM,
  EPIS2_FHIR_BASE,
  EPIS2_IDENTIFIER_SYSTEM_DEMO,
  EPIS2_PROFILES,
} from './constants.js';
import { UI_ONLY_EXPORT_KEYS } from './uiForbidden.js';
import type {
  Epis2DocumentReferenceResource,
  Epis2EncounterResource,
  Epis2PatientResource,
  Epis2ServiceRequestResource,
} from './profile.js';

export type PatientSource = {
  id: string;
  displayName: string;
  birthDate: string | null;
  sex: string | null;
  isSynthetic: boolean;
  demoIdentifier?: string;
};

export type EncounterSource = {
  id: string;
  patientId: string;
  status: string;
};

export type ClinicalNoteSource = {
  id: string;
  patientId: string;
  noteType: string;
  title: string;
  body: Record<string, unknown>;
  createdAt: Date;
};

export type LabDraftSource = {
  id: string;
  patientId: string;
  draftType: string;
  title: string;
  body: Record<string, unknown>;
};

function syntheticMeta(profile: string) {
  const meta: Epis2PatientResource['meta'] = { profile: [profile] };
  return meta;
}

function syntheticTagMeta(profile: string, isSynthetic: boolean) {
  const meta = syntheticMeta(profile);
  if (isSynthetic) {
    meta.tag = [
      {
        system: EPIS2_DATA_ORIGIN_SYSTEM,
        code: 'synthetic',
        display: 'DEMO/SINTÉTICO',
      },
    ];
  }
  return meta;
}

function mapSex(sex: string | null): Epis2PatientResource['gender'] {
  switch (sex) {
    case 'F':
      return 'female';
    case 'M':
      return 'male';
    case 'O':
      return 'other';
    default:
      return 'unknown';
  }
}

function patientReference(patientId: string) {
  return { reference: `Patient/${patientId}` };
}

/** Narrativa clínica desde JSON de nota/borrador (sin claves de UI). */
export function bodyToNarrative(body: Record<string, unknown>): string {
  const soapOrder = ['subjective', 'objective', 'assessment', 'plan', 'texto', 'text'];
  const lines: string[] = [];
  for (const key of soapOrder) {
    const value = body[key];
    if (typeof value === 'string' && value.trim()) {
      lines.push(`${key.toUpperCase()}: ${value.trim()}`);
    }
  }
  for (const [key, value] of Object.entries(body)) {
    if (soapOrder.includes(key) || UI_ONLY_EXPORT_KEYS.has(key)) continue;
    if (typeof value === 'string' && value.trim()) {
      lines.push(`${key}: ${value.trim()}`);
    }
  }
  return lines.join('\n') || 'Contenido clínico sintético (EPIS2 demo)';
}

export function toFhirPatient(source: PatientSource): Epis2PatientResource {
  const resource: Epis2PatientResource = {
    resourceType: 'Patient',
    id: source.id,
    meta: syntheticTagMeta(EPIS2_PROFILES.patient, source.isSynthetic),
    identifier: [
      {
        system: EPIS2_IDENTIFIER_SYSTEM_DEMO,
        value: source.demoIdentifier ?? `EPIS2-${source.id.slice(0, 8)}`,
      },
    ],
    name: [{ use: 'official', text: source.displayName }],
    gender: mapSex(source.sex),
  };
  if (source.birthDate) {
    resource.birthDate = source.birthDate;
  }
  return resource;
}

export function toFhirEncounter(source: EncounterSource): Epis2EncounterResource {
  return {
    resourceType: 'Encounter',
    id: source.id,
    meta: syntheticMeta(EPIS2_PROFILES.encounter),
    status: source.status === 'closed' ? 'finished' : 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
    },
    subject: patientReference(source.patientId),
  };
}

const NOTE_TYPE_LABELS: Record<string, string> = {
  evolution_note: 'Nota de evolución',
  discharge_summary: 'Epicrisis',
  prescription: 'Receta',
  lab_request: 'Solicitud de laboratorio',
  other: 'Documento clínico',
};

export function toFhirDocumentReference(
  source: ClinicalNoteSource,
  isSynthetic: boolean,
): Epis2DocumentReferenceResource {
  const narrative = bodyToNarrative(source.body);
  const encoded = Buffer.from(narrative, 'utf8').toString('base64');
  return {
    resourceType: 'DocumentReference',
    id: source.id,
    meta: syntheticTagMeta(EPIS2_PROFILES.documentReference, isSynthetic),
    status: 'current',
    type: {
      text: NOTE_TYPE_LABELS[source.noteType] ?? source.noteType,
    },
    subject: patientReference(source.patientId),
    date: source.createdAt.toISOString(),
    content: [
      {
        attachment: {
          contentType: 'text/plain',
          data: encoded,
          title: source.title,
        },
      },
    ],
  };
}

export function toFhirServiceRequest(
  source: LabDraftSource,
  isSynthetic: boolean,
): Epis2ServiceRequestResource | null {
  if (source.draftType !== 'lab_request') return null;
  const labTests = typeof source.body.labTests === 'string' ? source.body.labTests : '';
  const reason =
    typeof source.body.clinicalReason === 'string' ? source.body.clinicalReason : '';
  const priorityRaw = typeof source.body.priority === 'string' ? source.body.priority : '';
  const priority =
    priorityRaw === 'urgente' ? ('urgent' as const) : priorityRaw === 'rutina' ? ('routine' as const) : undefined;

  const resource: Epis2ServiceRequestResource = {
    resourceType: 'ServiceRequest',
    id: source.id,
    meta: syntheticTagMeta(EPIS2_PROFILES.serviceRequest, isSynthetic),
    status: 'active',
    intent: 'order',
    code: { text: labTests.trim() || source.title },
    subject: patientReference(source.patientId),
  };
  if (priority !== undefined) resource.priority = priority;
  if (reason.trim()) {
    resource.reasonCode = [{ text: reason.trim() }];
  }
  return resource;
}

export function buildPatientExportBundle(
  patient: Epis2PatientResource,
  encounters: Epis2EncounterResource[],
  documents: Epis2DocumentReferenceResource[],
  serviceRequests: Epis2ServiceRequestResource[],
) {
  const entries: { fullUrl: string; resource: Record<string, unknown> }[] = [
    {
      fullUrl: `${EPIS2_FHIR_BASE}/Patient/${patient.id}`,
      resource: patient as unknown as Record<string, unknown>,
    },
  ];
  for (const enc of encounters) {
    entries.push({
      fullUrl: `${EPIS2_FHIR_BASE}/Encounter/${enc.id}`,
      resource: enc as unknown as Record<string, unknown>,
    });
  }
  for (const doc of documents) {
    entries.push({
      fullUrl: `${EPIS2_FHIR_BASE}/DocumentReference/${doc.id}`,
      resource: doc as unknown as Record<string, unknown>,
    });
  }
  for (const sr of serviceRequests) {
    entries.push({
      fullUrl: `${EPIS2_FHIR_BASE}/ServiceRequest/${sr.id}`,
      resource: sr as unknown as Record<string, unknown>,
    });
  }
  return {
    resourceType: 'Bundle' as const,
    type: 'collection' as const,
    meta: { profile: [EPIS2_PROFILES.bundle] },
    entry: entries,
  };
}
