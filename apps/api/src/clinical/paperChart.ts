import {
  PAPER_CHART_DRAFT_TYPE,
  applyPaperChartSectionPatch,
  canSignPaperChart,
  emptyPaperChartDraft,
  parsePaperChartBody,
  type PaperChartDraftBody,
  type PaperChartSectionPatch,
} from '@epis2/clinical-forms';
import { and, desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDrafts } from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import { approveDraft, createDraft, updateDraft, type Actor } from './service.js';

export class PaperChartSignBlockedError extends Error {
  readonly blockers: string[];

  constructor(blockers: string[]) {
    super('Firma bloqueada: borradores IA sin confirmar');
    this.name = 'PaperChartSignBlockedError';
    this.blockers = blockers;
  }
}

export async function getPaperChartDraft(db: Database, patientId: string) {
  const [row] = await db
    .select()
    .from(clinicalDrafts)
    .where(
      and(
        eq(clinicalDrafts.patientId, patientId),
        eq(clinicalDrafts.draftType, PAPER_CHART_DRAFT_TYPE),
        eq(clinicalDrafts.status, 'draft'),
      ),
    )
    .orderBy(desc(clinicalDrafts.updatedAt))
    .limit(1);
  return row ?? null;
}

export async function getPaperChartDraftBody(
  db: Database,
  patientId: string,
): Promise<PaperChartDraftBody> {
  const draft = await getPaperChartDraft(db, patientId);
  if (!draft) return emptyPaperChartDraft();
  try {
    return parsePaperChartBody(draft.body);
  } catch {
    return emptyPaperChartDraft();
  }
}

export async function upsertPaperChartDraft(
  db: Database,
  actor: Actor,
  patientId: string,
  body: PaperChartDraftBody,
) {
  const existing = await getPaperChartDraft(db, patientId);
  if (existing) {
    const updated = await updateDraft(db, actor, existing.id, { body });
    return updated!;
  }
  return createDraft(db, actor, {
    patientId,
    draftType: PAPER_CHART_DRAFT_TYPE,
    title: 'Ficha clínica papel',
    body,
  });
}

export async function patchPaperChartSection(
  db: Database,
  actor: Actor,
  patientId: string,
  patch: PaperChartSectionPatch,
) {
  const current = await getPaperChartDraftBody(db, patientId);
  const next = applyPaperChartSectionPatch(current, patch);
  const draft = await upsertPaperChartDraft(db, actor, patientId, next);
  await appendAudit(db, {
    eventType: 'clinical.paper_chart.section_updated',
    actorId: actor.id,
    username: actor.username,
    entityType: 'clinical_draft',
    entityId: draft.id,
    payload: {
      sectionId: patch.sectionId,
      source: next[patch.sectionId].source,
      confirmed: next[patch.sectionId].confirmed,
    },
  });
  return { draft, sections: next };
}

export function validatePaperChartSign(body: PaperChartDraftBody) {
  return canSignPaperChart(body);
}

export type PaperChartLoadState = {
  patientId: string;
  sections: PaperChartDraftBody;
  draftId?: string;
  readOnly: boolean;
  status: 'draft' | 'approved' | 'empty';
};

/** Carga borrador activo o última ficha firmada (read-only). */
export async function getPaperChartState(
  db: Database,
  patientId: string,
): Promise<PaperChartLoadState> {
  const draft = await getPaperChartDraft(db, patientId);
  if (draft) {
    let sections: PaperChartDraftBody;
    try {
      sections = parsePaperChartBody(draft.body);
    } catch {
      sections = emptyPaperChartDraft();
    }
    return {
      patientId,
      sections,
      draftId: draft.id,
      readOnly: false,
      status: 'draft',
    };
  }

  const [approved] = await db
    .select()
    .from(clinicalDrafts)
    .where(
      and(
        eq(clinicalDrafts.patientId, patientId),
        eq(clinicalDrafts.draftType, PAPER_CHART_DRAFT_TYPE),
        eq(clinicalDrafts.status, 'approved'),
      ),
    )
    .orderBy(desc(clinicalDrafts.updatedAt))
    .limit(1);

  if (approved) {
    let sections: PaperChartDraftBody;
    try {
      sections = parsePaperChartBody(approved.body);
    } catch {
      sections = emptyPaperChartDraft();
    }
    return {
      patientId,
      sections,
      draftId: approved.id,
      readOnly: true,
      status: 'approved',
    };
  }

  return {
    patientId,
    sections: emptyPaperChartDraft(),
    readOnly: false,
    status: 'empty',
  };
}

/** Firma ficha papel — valida IA pendiente y aprueba borrador SoT. */
export async function approvePaperChartDraft(
  db: Database,
  actor: Actor,
  patientId: string,
) {
  const body = await getPaperChartDraftBody(db, patientId);
  const signCheck = validatePaperChartSign(body);
  if (!signCheck.ok) {
    throw new PaperChartSignBlockedError(signCheck.errors.map((e) => e.message));
  }
  const draft = await getPaperChartDraft(db, patientId);
  if (!draft) {
    throw new Error('No hay borrador paper_chart activo');
  }
  const result = await approveDraft(db, actor, draft.id);
  if (!result?.draft) {
    throw new Error('No se pudo firmar el borrador');
  }
  await appendAudit(db, {
    eventType: 'clinical.paper_chart.approved',
    actorId: actor.id,
    username: actor.username,
    entityType: 'clinical_draft',
    entityId: draft.id,
    payload: { noteId: result.note.id, patientId },
  });
  return {
    draftId: result.draft.id,
    noteId: result.note.id,
    readOnly: true as const,
  };
}
