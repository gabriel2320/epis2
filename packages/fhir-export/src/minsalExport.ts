import {
  DEFAULT_RUN_IDENTIFIER_TYPE,
  MINSAL_PROFILES,
  mapPatientIdentifierToFhir,
  type ChilePatientIdentifierType,
} from '@epis2/clinical-domain';
import { syntheticOriginTag } from './chileInteropMeta.js';
import {
  EPIS2_AIAST_SYSTEM,
  EPIS2_CL_FHIR_BASE,
  EPIS2_IDENTIFIER_SYSTEM_DEMO,
} from './constants.js';

export { MINSAL_PROFILES } from '@epis2/clinical-domain';
import {
  bodyToNarrative,
  type ClinicalNoteSource,
  type DocumentReferenceOptions,
  type EncounterSource,
  type PatientSource,
} from './mappers.js';
import type {
  Epis2DocumentReferenceResource,
  Epis2EncounterResource,
  Epis2PatientResource,
} from './profile.js';
import {
  epis2DocumentReferenceResourceSchema,
  epis2EncounterResourceSchema,
  epis2PatientResourceSchema,
} from './profile.js';

const NOTE_TYPE_LABELS: Record<string, string> = {
  evolution_note: 'Nota de evolución',
  discharge_summary: 'Epicrisis',
  prescription: 'Receta',
  lab_request: 'Solicitud de laboratorio',
  other: 'Documento clínico',
};

function minsalMeta(profile: string, isSynthetic?: boolean, extraTags?: Epis2PatientResource['meta']['tag']) {
  const meta: Epis2PatientResource['meta'] = { profile: [profile] };
  const tags = [];
  const synthetic = syntheticOriginTag(isSynthetic ?? false);
  if (synthetic) tags.push(synthetic);
  if (extraTags?.length) tags.push(...extraTags);
  if (tags.length) meta.tag = tags;
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

export type MinsalPatientSource = PatientSource & {
  rut?: string;
  identifierType?: ChilePatientIdentifierType;
};

export function toMinsalFhirPatient(source: MinsalPatientSource): Epis2PatientResource {
  const identifierType = source.identifierType ?? DEFAULT_RUN_IDENTIFIER_TYPE;
  const identifiers: Epis2PatientResource['identifier'] = [];

  if (source.rut) {
    identifiers.push(
      mapPatientIdentifierToFhir(source.rut, identifierType) as Epis2PatientResource['identifier'][number],
    );
  }

  identifiers.push({
    system: EPIS2_IDENTIFIER_SYSTEM_DEMO,
    value: source.demoIdentifier ?? `EPIS2-${source.id.slice(0, 8)}`,
  });

  const resource: Epis2PatientResource = {
    resourceType: 'Patient',
    id: source.id,
    meta: minsalMeta(MINSAL_PROFILES.patient, source.isSynthetic),
    identifier: identifiers,
    name: [{ use: 'official', text: source.displayName }],
    gender: mapSex(source.sex),
  };
  if (source.birthDate) {
    resource.birthDate = source.birthDate;
  }
  return resource;
}

export function toMinsalFhirEncounter(source: EncounterSource): Epis2EncounterResource {
  return {
    resourceType: 'Encounter',
    id: source.id,
    meta: minsalMeta(MINSAL_PROFILES.encounter),
    status: source.status === 'closed' ? 'finished' : 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
    },
    subject: patientReference(source.patientId),
  };
}

export function toMinsalFhirDocumentReference(
  source: ClinicalNoteSource,
  isSynthetic: boolean,
  options?: DocumentReferenceOptions,
): Epis2DocumentReferenceResource {
  const narrative = bodyToNarrative(source.body);
  const encoded = Buffer.from(narrative, 'utf8').toString('base64');
  const hasAiAssist = options?.aiProvenance !== undefined;
  const aiastTag = hasAiAssist
    ? [{ system: EPIS2_AIAST_SYSTEM, code: 'AIAST', display: 'Asistido por IA' }]
    : undefined;

  return {
    resourceType: 'DocumentReference',
    id: source.id,
    meta: minsalMeta(MINSAL_PROFILES.documentReference, isSynthetic, aiastTag),
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

export function buildMinsalExportBundle(
  patient: Epis2PatientResource,
  encounters: Epis2EncounterResource[],
  documents: Epis2DocumentReferenceResource[],
) {
  const entries: { fullUrl: string; resource: Record<string, unknown> }[] = [
    {
      fullUrl: `${EPIS2_CL_FHIR_BASE}/Patient/${patient.id}`,
      resource: patient as unknown as Record<string, unknown>,
    },
  ];
  for (const enc of encounters) {
    entries.push({
      fullUrl: `${EPIS2_CL_FHIR_BASE}/Encounter/${enc.id}`,
      resource: enc as unknown as Record<string, unknown>,
    });
  }
  for (const doc of documents) {
    entries.push({
      fullUrl: `${EPIS2_CL_FHIR_BASE}/DocumentReference/${doc.id}`,
      resource: doc as unknown as Record<string, unknown>,
    });
  }
  return {
    resourceType: 'Bundle' as const,
    type: 'collection' as const,
    meta: { profile: [MINSAL_PROFILES.bundle] },
    entry: entries,
  };
}

export function validateMinsalPatientResource(resource: unknown) {
  const parsed = epis2PatientResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(MINSAL_PROFILES.patient)) {
    return { ok: false as const, errors: { formErrors: ['meta.profile minsal-patient requerido'] } };
  }
  return { ok: true as const, resource: parsed.data };
}

export function validateMinsalEncounterResource(resource: unknown) {
  const parsed = epis2EncounterResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(MINSAL_PROFILES.encounter)) {
    return { ok: false as const, errors: { formErrors: ['meta.profile minsal-encounter requerido'] } };
  }
  return { ok: true as const, resource: parsed.data };
}

export function validateMinsalDocumentReferenceResource(resource: unknown) {
  const parsed = epis2DocumentReferenceResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(MINSAL_PROFILES.documentReference)) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.profile minsal-document-reference requerido'] },
    };
  }
  return { ok: true as const, resource: parsed.data };
}
