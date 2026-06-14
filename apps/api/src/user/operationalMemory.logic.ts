import {
  operationalMemoryGlobalPayloadSchema,
  operationalMemoryPatientPayloadSchema,
  type OperationalRecentPatient,
  type PatchOperationalMemoryRequest,
} from '@epis2/contracts';

export const OPERATIONAL_MEMORY_GLOBAL_SCOPE = 'global';
export const MAX_RECENT_PATIENTS = 5;

export function mergeRecentPatients(
  current: readonly OperationalRecentPatient[],
  incoming: OperationalRecentPatient,
): OperationalRecentPatient[] {
  const accessedAt = incoming.accessedAt ?? new Date().toISOString();
  const next = [
    { ...incoming, accessedAt },
    ...current.filter((row) => row.id !== incoming.id),
  ];
  return next.slice(0, MAX_RECENT_PATIENTS);
}

export function parseGlobalPayload(raw: unknown) {
  const parsed = operationalMemoryGlobalPayloadSchema.safeParse(raw ?? {});
  return parsed.success ? parsed.data : operationalMemoryGlobalPayloadSchema.parse({});
}

export function parsePatientPayload(raw: unknown) {
  const parsed = operationalMemoryPatientPayloadSchema.safeParse(raw ?? {});
  return parsed.success ? parsed.data : {};
}

export function applyOperationalMemoryPatch(
  globalPayload: ReturnType<typeof parseGlobalPayload>,
  patientPayload: ReturnType<typeof parsePatientPayload>,
  patch: PatchOperationalMemoryRequest,
  recentPatient?: OperationalRecentPatient,
) {
  const nextGlobal = { ...globalPayload };
  const nextPatient = { ...patientPayload };

  if (patch.recentPatients) {
    nextGlobal.recentPatients = patch.recentPatients.slice(0, MAX_RECENT_PATIENTS);
  } else if (recentPatient) {
    nextGlobal.recentPatients = mergeRecentPatients(globalPayload.recentPatients, recentPatient);
  }

  if (patch.favoriteBlueprintIds) {
    nextGlobal.favoriteBlueprintIds = [...new Set(patch.favoriteBlueprintIds)];
  }

  if (patch.catalogUsage) {
    nextGlobal.catalogUsage = patch.catalogUsage;
  }

  if (patch.traditionalSection !== undefined) {
    nextPatient.traditionalSection = patch.traditionalSection;
  }
  if (patch.chartMode !== undefined) {
    nextPatient.chartMode = patch.chartMode;
  }

  return { global: nextGlobal, patient: nextPatient };
}
