import {
  operationalMemoryResponseSchema,
  type OperationalMemoryResponse,
  type PatchOperationalMemoryRequest,
} from '@epis2/contracts';
import { and, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { userOperationalMemory } from '../db/schema.js';
import { runWithRlsContext } from '../db/rlsContext.js';
import type { AppConfig } from '../config.js';
import type { SessionClaims } from '../auth/sessionToken.js';
import {
  OPERATIONAL_MEMORY_GLOBAL_SCOPE,
  applyOperationalMemoryPatch,
  mergeRecentPatients,
  parseGlobalPayload,
  parsePatientPayload,
} from './operationalMemory.logic.js';

async function readScopePayload(db: Database, userId: string, scope: string) {
  const [row] = await db
    .select()
    .from(userOperationalMemory)
    .where(and(eq(userOperationalMemory.userId, userId), eq(userOperationalMemory.scope, scope)))
    .limit(1);
  return row ?? null;
}

async function upsertScopePayload(db: Database, userId: string, scope: string, payload: unknown) {
  const now = new Date();
  const [row] = await db
    .insert(userOperationalMemory)
    .values({
      userId,
      scope,
      payload,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [userOperationalMemory.userId, userOperationalMemory.scope],
      set: {
        payload,
        updatedAt: now,
      },
    })
    .returning();
  return row!;
}

export async function getOperationalMemoryForUser(
  db: Database,
  config: Pick<AppConfig, 'RLS_MODE'>,
  session: SessionClaims,
  patientId?: string,
): Promise<OperationalMemoryResponse> {
  return runWithRlsContext(db, config, session, async (tx) => {
    const globalRow = await readScopePayload(tx, session.sub, OPERATIONAL_MEMORY_GLOBAL_SCOPE);
    const patientRow =
      patientId !== undefined ? await readScopePayload(tx, session.sub, patientId) : null;

    return operationalMemoryResponseSchema.parse({
      userId: session.sub,
      global: parseGlobalPayload(globalRow?.payload),
      patient: patientRow ? parsePatientPayload(patientRow.payload) : null,
      updatedAt: patientRow?.updatedAt?.toISOString() ?? globalRow?.updatedAt?.toISOString() ?? null,
    });
  });
}

export async function patchOperationalMemoryForUser(
  db: Database,
  config: Pick<AppConfig, 'RLS_MODE'>,
  session: SessionClaims,
  patch: PatchOperationalMemoryRequest,
  patientId?: string,
): Promise<OperationalMemoryResponse> {
  return runWithRlsContext(db, config, session, async (tx) => {
    const globalRow = await readScopePayload(tx, session.sub, OPERATIONAL_MEMORY_GLOBAL_SCOPE);
    const globalPayload = parseGlobalPayload(globalRow?.payload);

    let patientPayload = {};
    if (patientId !== undefined) {
      const patientRow = await readScopePayload(tx, session.sub, patientId);
      patientPayload = parsePatientPayload(patientRow?.payload);
    }

    const merged = applyOperationalMemoryPatch(globalPayload, patientPayload, patch);
    await upsertScopePayload(tx, session.sub, OPERATIONAL_MEMORY_GLOBAL_SCOPE, merged.global);
    if (patientId !== undefined) {
      await upsertScopePayload(tx, session.sub, patientId, merged.patient);
    }

    return getOperationalMemoryForUser(tx, config, session, patientId);
  });
}

/** Registra paciente reciente al fijar contexto clínico. */
export async function touchRecentPatient(
  db: Database,
  config: Pick<AppConfig, 'RLS_MODE'>,
  session: SessionClaims,
  patient: { id: string; displayName: string; demoCaseCode?: string | undefined },
): Promise<void> {
  await runWithRlsContext(db, config, session, async (tx) => {
    const globalRow = await readScopePayload(tx, session.sub, OPERATIONAL_MEMORY_GLOBAL_SCOPE);
    const globalPayload = parseGlobalPayload(globalRow?.payload);
    const merged = mergeRecentPatients(globalPayload.recentPatients, {
      id: patient.id,
      displayName: patient.displayName,
      accessedAt: new Date().toISOString(),
      ...(patient.demoCaseCode ? { demoCaseCode: patient.demoCaseCode } : {}),
    });
    await upsertScopePayload(tx, session.sub, OPERATIONAL_MEMORY_GLOBAL_SCOPE, {
      ...globalPayload,
      recentPatients: merged,
    });
  });
}
