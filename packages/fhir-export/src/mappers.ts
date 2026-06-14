import type { AiProvenanceRecord } from '@epis2/contracts';
import {
  EPIS2_AIAST_SYSTEM,
  EPIS2_AI_RUN_SYSTEM,
  EPIS2_DATA_ORIGIN_SYSTEM,
  EPIS2_FHIR_BASE,
  EPIS2_IDENTIFIER_SYSTEM_DEMO,
  EPIS2_MODEL_CARD_SYSTEM,
  EPIS2_MODEL_CARD_VERSION,
  EPIS2_PROFILES,
} from './constants.js';
import { UI_ONLY_EXPORT_KEYS } from './uiForbidden.js';
import type {
  Epis2DocumentReferenceResource,
  Epis2EncounterResource,
  Epis2MedicationRequestResource,
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

function documentReferenceMeta(isSynthetic: boolean, hasAiAssist: boolean) {
  const meta = syntheticTagMeta(EPIS2_PROFILES.documentReference, isSynthetic);
  if (hasAiAssist) {
    meta.tag = [
      ...(meta.tag ?? []),
      {
        system: EPIS2_AIAST_SYSTEM,
        code: 'AIAST',
        display: 'Asistido por IA',
      },
    ];
  }
  return meta;
}

function aiDeviceIdFromModel(model: string): string {
  const slug = model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `ai-device-${slug || 'unknown'}`;
}

function aiModelCardIdFromModel(model: string): string {
  const slug = model
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `epis2-ai-model-card-${slug || 'v1'}`;
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

export type DocumentReferenceOptions = {
  aiProvenance?: AiProvenanceRecord;
};

export function toFhirDocumentReference(
  source: ClinicalNoteSource,
  isSynthetic: boolean,
  options?: DocumentReferenceOptions,
): Epis2DocumentReferenceResource {
  const narrative = bodyToNarrative(source.body);
  const encoded = Buffer.from(narrative, 'utf8').toString('base64');
  return {
    resourceType: 'DocumentReference',
    id: source.id,
    meta: documentReferenceMeta(isSynthetic, options?.aiProvenance !== undefined),
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
  const reason = typeof source.body.clinicalReason === 'string' ? source.body.clinicalReason : '';
  const priorityRaw = typeof source.body.priority === 'string' ? source.body.priority : '';
  const priority =
    priorityRaw === 'urgente'
      ? ('urgent' as const)
      : priorityRaw === 'rutina'
        ? ('routine' as const)
        : undefined;

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

export type AllergySource = {
  id: string;
  patientId: string;
  substance: string;
  severity: string;
};

export type MedicationSource = {
  id: string;
  patientId: string;
  name: string;
  doseText?: string | null;
  status: string;
};

export function toFhirAllergyIntolerance(source: AllergySource, isSynthetic: boolean) {
  const criticality =
    source.severity === 'severe' ? 'high' : source.severity === 'mild' ? 'low' : 'low';
  return {
    resourceType: 'AllergyIntolerance' as const,
    id: source.id,
    meta: syntheticTagMeta(EPIS2_PROFILES.allergyIntolerance, isSynthetic),
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
          code: 'active',
        },
      ],
    },
    code: { text: source.substance },
    patient: patientReference(source.patientId),
    criticality,
  };
}

export type PrescriptionDraftSource = {
  id: string;
  patientId: string;
  draftType: string;
  body: Record<string, unknown>;
};

function readBodyString(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === 'string' ? value.trim() : '';
}

function parseQuantity(value: string): number | undefined {
  const match = value.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return undefined;
  const parsed = Number.parseFloat(match[1]!.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** MF-CHILE-RX-01 — MedicationRequest mínimo (SNRE / FHIR frontera demo). */
export function toFhirMedicationRequest(
  source: PrescriptionDraftSource,
  isSynthetic: boolean,
): Epis2MedicationRequestResource | null {
  if (source.draftType !== 'prescription') return null;

  const medication = readBodyString(source.body, 'medication');
  if (!medication) return null;

  const dose = readBodyString(source.body, 'dose');
  const quantity = readBodyString(source.body, 'quantity');
  const route = readBodyString(source.body, 'route');
  const frequency = readBodyString(source.body, 'frequency');
  const duration = readBodyString(source.body, 'duration');
  const patientInstructions = readBodyString(source.body, 'patientInstructions');

  const dosageParts = [dose, frequency, duration].filter(Boolean);
  const dosageText = dosageParts.length ? dosageParts.join(' · ') : undefined;
  const qtyValue = parseQuantity(quantity);

  const resource: Epis2MedicationRequestResource = {
    resourceType: 'MedicationRequest',
    id: source.id,
    meta: syntheticTagMeta(EPIS2_PROFILES.medicationRequest, isSynthetic),
    status: 'draft',
    intent: 'order',
    medicationCodeableConcept: { text: medication },
    subject: patientReference(source.patientId),
    dosageInstruction: [
      {
        text: dosageText,
        patientInstruction: patientInstructions || undefined,
        route: route ? { text: route } : undefined,
        timing: frequency ? { code: { text: frequency } } : undefined,
      },
    ],
  };

  if (qtyValue !== undefined) {
    resource.dispenseRequest = { quantity: { value: qtyValue, unit: 'unidad' } };
  }

  return resource;
}

export function toFhirMedicationStatement(source: MedicationSource, isSynthetic: boolean) {
  return {
    resourceType: 'MedicationStatement' as const,
    id: source.id,
    meta: syntheticTagMeta(EPIS2_PROFILES.medicationStatement, isSynthetic),
    status: source.status === 'active' ? 'active' : 'stopped',
    medicationCodeableConcept: { text: source.name },
    subject: patientReference(source.patientId),
    dosage: source.doseText ? [{ text: source.doseText }] : undefined,
  };
}

export type AssistProvenanceSource = {
  noteId: string;
  patientId: string;
  aiProvenance: AiProvenanceRecord;
  approvedAt: Date;
};

/** Device FHIR mínimo para modelo IA (MF-IM-06). */
export function toFhirAiDevice(model: string) {
  return {
    resourceType: 'Device' as const,
    id: aiDeviceIdFromModel(model),
    meta: syntheticMeta(EPIS2_PROFILES.device),
    deviceName: [{ name: model, type: 'model-name' as const }],
    status: 'active' as const,
  };
}

/** Provenance FHIR post-approve asistido — apunta a DocumentReference + Device + model card. */
export function toFhirProvenance(source: AssistProvenanceSource, modelCardId?: string) {
  const deviceId = aiDeviceIdFromModel(source.aiProvenance.model);
  const entity: {
    role: 'source' | 'derivation';
    what: { reference?: string; identifier?: { system: string; value: string } };
  }[] = [
    {
      role: 'source',
      what: {
        identifier: {
          system: EPIS2_AI_RUN_SYSTEM,
          value: source.aiProvenance.aiRunId,
        },
      },
    },
  ];
  if (modelCardId) {
    entity.push({
      role: 'derivation',
      what: { reference: `DocumentReference/${modelCardId}` },
    });
  }
  return {
    resourceType: 'Provenance' as const,
    id: `prov-${source.noteId}`,
    meta: syntheticMeta(EPIS2_PROFILES.provenance),
    target: [{ reference: `DocumentReference/${source.noteId}` }],
    recorded: source.approvedAt.toISOString(),
    activity: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-DataOperation',
          code: 'CREATE',
          display: 'create',
        },
      ],
    },
    agent: [
      {
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/provenance-participant-type',
              code: 'assembler',
              display: 'Assembler',
            },
          ],
        },
        who: { reference: `Device/${deviceId}` },
      },
    ],
    entity,
  };
}

export type AiModelCardSource = {
  model: string;
  promptHash: string;
  blueprintId: string;
  cardVersion: string;
};

/** Markdown embebido para export FHIR (model card runtime). */
export function buildAiModelCardMarkdown(source: AiModelCardSource): string {
  return `# Model Card IA — EPIS2 Assist

**Versión:** \`${source.cardVersion}\`
**Modelo:** \`${source.model}\`
**Blueprint:** \`${source.blueprintId}\`
**Prompt hash:** \`${source.promptHash}\`

## Stack

- Runtime: Ollama local (EPIS2 demo)
- Aprobación humana obligatoria — sin auto-aprobación
- IA no escribe SoT; borrador ≠ dato aprobado

## Política de prompt

- Blueprint clínico versionado (\`blueprintId\`)
- Hash de prompt (\`promptHash\`) para reproducibilidad
- Contexto RAG limitado al expediente del paciente (demo/sintético)

## Identificador

- Sistema: \`${EPIS2_MODEL_CARD_SYSTEM}\`
- Valor: \`${source.cardVersion}\`
`;
}

/** DocumentReference markdown con model card estática (MF-IM-07). */
export function toFhirAiModelCardDocumentReference(source: AiModelCardSource) {
  const markdown = buildAiModelCardMarkdown(source);
  const encoded = Buffer.from(markdown, 'utf8').toString('base64');
  const id = aiModelCardIdFromModel(source.model);
  return {
    resourceType: 'DocumentReference' as const,
    id,
    meta: syntheticMeta(EPIS2_PROFILES.documentReference),
    status: 'current' as const,
    type: { text: 'Model Card IA EPIS2' },
    identifier: [{ system: EPIS2_MODEL_CARD_SYSTEM, value: source.cardVersion }],
    date: new Date().toISOString(),
    content: [
      {
        attachment: {
          contentType: 'text/markdown' as const,
          data: encoded,
          title: `Model Card — ${source.model}`,
        },
      },
    ],
  };
}

/** Entradas extras (Device + model card + Provenance) para bundle de export asistido. */
export function buildAssistProvenanceExtras(source: AssistProvenanceSource): Record<string, unknown>[] {
  const modelCard = toFhirAiModelCardDocumentReference({
    model: source.aiProvenance.model,
    promptHash: source.aiProvenance.promptHash,
    blueprintId: source.aiProvenance.blueprintId,
    cardVersion: EPIS2_MODEL_CARD_VERSION,
  });
  return [
    toFhirAiDevice(source.aiProvenance.model),
    modelCard,
    toFhirProvenance(source, modelCard.id),
  ];
}

export function buildPatientExportBundle(
  patient: Epis2PatientResource,
  encounters: Epis2EncounterResource[],
  documents: Epis2DocumentReferenceResource[],
  serviceRequests: Epis2ServiceRequestResource[],
  extras: Record<string, unknown>[] = [],
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
  for (const extra of extras) {
    const rt = extra.resourceType as string;
    const id = extra.id as string;
    entries.push({
      fullUrl: `${EPIS2_FHIR_BASE}/${rt}/${id}`,
      resource: extra,
    });
  }
  return {
    resourceType: 'Bundle' as const,
    type: 'collection' as const,
    meta: { profile: [EPIS2_PROFILES.bundle] },
    entry: entries,
  };
}
