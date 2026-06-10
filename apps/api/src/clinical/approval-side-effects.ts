import { formatSurgicalHistoryDescription } from '@epis2/clinical-domain';
import { and, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { encounters, marAdministrationRecords, patientAllergies, problems } from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import {
  createInpatientAdmission,
  getActiveAdmission,
  transferInpatientAdmission,
} from '../inpatient/admissions.js';
import type { Actor } from './service.js';

export type ApprovableDraft = {
  id: string;
  patientId: string;
  encounterId: string | null;
  draftType: string;
  title: string;
  body: unknown;
};

export type ApprovalSideEffectContext = {
  draft: ApprovableDraft;
  actor: Actor;
  now: Date;
};

type ApprovalSideEffectHandler = (tx: Database, ctx: ApprovalSideEffectContext) => Promise<void>;

function draftBody(draft: ApprovableDraft): Record<string, unknown> {
  return (draft.body ?? {}) as Record<string, unknown>;
}

async function admissionNote(tx: Database, { draft, actor }: ApprovalSideEffectContext) {
  const body = draftBody(draft);
  const rawBed = typeof body.targetBedId === 'string' ? body.targetBedId : '';
  const bedId = rawBed.split('|')[0]?.trim();
  if (!bedId) return;
  await createInpatientAdmission(tx, {
    patientId: draft.patientId,
    bedId,
    actorId: actor.id,
    username: actor.username,
  });
}

async function allergyEntry(tx: Database, { draft, actor }: ApprovalSideEffectContext) {
  const body = draftBody(draft);
  const substance = typeof body.substance === 'string' ? body.substance.trim() : '';
  const severity = typeof body.severity === 'string' ? body.severity : 'moderate';
  if (!substance) return;
  await tx.insert(patientAllergies).values({
    patientId: draft.patientId,
    substance,
    severity,
    createdBy: actor.id,
  });
}

async function clinicalProblemEntry(tx: Database, { draft, actor }: ApprovalSideEffectContext) {
  const body = draftBody(draft);
  let description = typeof body.description === 'string' ? body.description.trim() : draft.title;
  const status = typeof body.status === 'string' ? body.status : 'active';
  const category =
    typeof body.problemCategory === 'string'
      ? body.problemCategory.split('|')[0]
      : 'active_problem';
  if (category === 'surgical_history' && description) {
    description = formatSurgicalHistoryDescription(description);
  }
  if (!description) return;
  await tx.insert(problems).values({
    patientId: draft.patientId,
    encounterId: draft.encounterId,
    description,
    status,
    createdBy: actor.id,
  });
}

async function medicationAdministration(tx: Database, { draft, actor }: ApprovalSideEffectContext) {
  const body = draftBody(draft);
  const medication = typeof body.medication === 'string' ? body.medication : draft.title;
  const doseText = typeof body.dose === 'string' ? body.dose : '—';
  const route = typeof body.route === 'string' ? body.route : '—';
  const doubleCheck = body.doubleCheckConfirmed === true || body.doubleCheckConfirmed === 'true';
  await tx.insert(marAdministrationRecords).values({
    patientId: draft.patientId,
    draftId: draft.id,
    medication,
    doseText,
    route,
    doubleCheck,
    createdBy: actor.id,
  });
}

async function transferNote(tx: Database, { draft, actor }: ApprovalSideEffectContext) {
  const body = draftBody(draft);
  const rawBed = typeof body.targetBedId === 'string' ? body.targetBedId : '';
  const bedId = rawBed.split('|')[0]?.trim();
  if (!bedId) return;
  const admission = await getActiveAdmission(tx, draft.patientId);
  if (!admission) return;
  await transferInpatientAdmission(tx, admission.id, bedId, {
    id: actor.id,
    username: actor.username,
  });
}

async function outpatientVisit(tx: Database, { draft, actor, now }: ApprovalSideEffectContext) {
  const body = draftBody(draft);
  const shouldClose = body.closeEncounter === true || body.closeEncounter === 'true';
  if (!shouldClose) return;
  const encounterFilter = draft.encounterId
    ? and(eq(encounters.id, draft.encounterId), eq(encounters.status, 'open'))
    : and(eq(encounters.patientId, draft.patientId), eq(encounters.status, 'open'));
  await tx.update(encounters).set({ status: 'closed', endedAt: now }).where(encounterFilter);
  await appendAudit(tx, {
    eventType: 'clinical.encounter.closed',
    actorId: actor.id,
    username: actor.username,
    entityType: 'encounter',
    entityId: draft.encounterId ?? draft.patientId,
    message: 'Cierre de episodio tras aprobación de consulta ambulatoria',
  });
}

/**
 * Side-effects SoT por tipo de borrador, ejecutados dentro de la transacción de
 * approveDraft (M7/M13 auditoría). Tipos sin entrada no generan side-effects.
 */
const APPROVAL_SIDE_EFFECTS: Record<string, ApprovalSideEffectHandler> = {
  admission_note: admissionNote,
  allergy_entry: allergyEntry,
  clinical_problem_entry: clinicalProblemEntry,
  medication_administration: medicationAdministration,
  transfer_note: transferNote,
  outpatient_visit: outpatientVisit,
};

export async function runApprovalSideEffects(tx: Database, ctx: ApprovalSideEffectContext) {
  const handler = APPROVAL_SIDE_EFFECTS[ctx.draft.draftType];
  if (!handler) return;
  await handler(tx, ctx);
}
