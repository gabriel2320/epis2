import {
  PAPER_CHART_DRAFT_TYPE,
  emptyPaperChartDraft,
  mergePaperChartSection,
  parsePaperChartBody,
  type PaperChartDraftBody,
  type PaperChartSectionId,
} from '@epis2/clinical-forms';
import { and, desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDrafts } from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import { createDraft, updateDraft, type Actor } from './service.js';

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
  sectionId: PaperChartSectionId,
  sectionBody: string,
) {
  const current = await getPaperChartDraftBody(db, patientId);
  const next = mergePaperChartSection(current, sectionId, sectionBody);
  const draft = await upsertPaperChartDraft(db, actor, patientId, next);
  await appendAudit(db, {
    eventType: 'clinical.paper_chart.section_updated',
    actorId: actor.id,
    username: actor.username,
    entityType: 'clinical_draft',
    entityId: draft.id,
  });
  return { draft, sections: next };
}
