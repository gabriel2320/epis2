import { and, eq, isNull } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalCriticalResults } from '../db/schema.js';
import type { Actor } from './service.js';

const GUARDED_DRAFT_TYPES = new Set(['discharge_summary', 'transfer_note']);

export type DischargeApprovalGuardInput = {
  draftId: string;
  patientId: string;
  draftType: string;
  clinicalOverrideReason?: string | undefined;
};

export type DischargeApprovalGuardResult = {
  overrideApplied: boolean;
};

type PendingCritical = {
  id: string;
  label: string;
  severity: string;
};

export class DischargeApprovalBlockedError extends Error {
  readonly pending: PendingCritical[];
  readonly detail: string;

  constructor(message: string, detail: string, pending: PendingCritical[]) {
    super(message);
    this.name = 'DischargeApprovalBlockedError';
    this.detail = detail;
    this.pending = pending;
  }

  get auditMessage() {
    return `${this.detail} - pendientes: ${formatPendingList(this.pending)}`;
  }
}

async function listUnacknowledgedCriticals(
  db: Database,
  patientId: string,
): Promise<PendingCritical[]> {
  return db
    .select({
      id: clinicalCriticalResults.id,
      label: clinicalCriticalResults.label,
      severity: clinicalCriticalResults.severity,
    })
    .from(clinicalCriticalResults)
    .where(
      and(
        eq(clinicalCriticalResults.patientId, patientId),
        isNull(clinicalCriticalResults.acknowledgedAt),
      ),
    );
}

function formatPendingList(rows: PendingCritical[]): string {
  return rows.map((r) => `${r.label} (${r.severity})`).join('; ');
}

/**
 * Política mixta (triage 2026-06-10):
 * - severidad `critical` sin acuse -> bloqueo duro;
 * - severidad `high` sin acuse -> requiere `clinicalOverrideReason` documentado;
 * - otras severidades sin acuse -> bloqueo hasta acuse u override explícito futuro.
 */
export async function assertDischargeApprovalAllowed(
  db: Database,
  _actor: Actor,
  input: DischargeApprovalGuardInput,
): Promise<DischargeApprovalGuardResult> {
  if (!GUARDED_DRAFT_TYPES.has(input.draftType)) {
    return { overrideApplied: false };
  }

  const pending = await listUnacknowledgedCriticals(db, input.patientId);
  if (pending.length === 0) {
    return { overrideApplied: false };
  }

  const critical = pending.filter((r) => r.severity === 'critical');
  if (critical.length > 0) {
    const detail = 'Aprobación bloqueada: resultados críticos sin acuse';
    throw new DischargeApprovalBlockedError(
      `No se puede aprobar la epicrisis: hay resultados críticos sin acuse (${formatPendingList(critical)}). Acuse los resultados antes de firmar el alta.`,
      detail,
      critical,
    );
  }

  const high = pending.filter((r) => r.severity === 'high');
  if (high.length > 0) {
    const reason = input.clinicalOverrideReason?.trim();
    if (!reason) {
      const detail =
        'Aprobación bloqueada: resultados de alta severidad sin acuse ni justificación';
      throw new DischargeApprovalBlockedError(
        `No se puede aprobar la epicrisis: hay resultados de alta severidad sin acuse (${formatPendingList(high)}). Proporcione clinicalOverrideReason con justificación clínica o acuse los resultados.`,
        detail,
        high,
      );
    }
    return { overrideApplied: true };
  }

  const detail = 'Aprobación bloqueada: resultados pendientes de acuse';
  throw new DischargeApprovalBlockedError(
    `No se puede aprobar la epicrisis: hay resultados pendientes de acuse (${formatPendingList(pending)}).`,
    detail,
    pending,
  );
}
