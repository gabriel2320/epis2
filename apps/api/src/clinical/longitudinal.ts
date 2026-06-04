import { desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  clinicalDocuments,
  clinicalDrafts,
  clinicalNotes,
  encounters,
  observations,
  patientAllergies,
  patientMedications,
  problems,
} from '../db/schema.js';
import { getPatientDemoCaseCode } from './service.js';

export type TimelineEvent = {
  id: string;
  kind: 'encounter' | 'note' | 'observation' | 'document' | 'draft';
  at: Date;
  title: string;
  detail?: string;
  entityId?: string;
};

export async function getPatientLongitudinal(db: Database, patientId: string) {
  const demoCaseCode = await getPatientDemoCaseCode(db, patientId);

  const [problemRows, allergyRows, medRows, obsRows, docRows, encRows, noteRows, draftRows] =
    await Promise.all([
      db.select().from(problems).where(eq(problems.patientId, patientId)),
      db.select().from(patientAllergies).where(eq(patientAllergies.patientId, patientId)),
      db.select().from(patientMedications).where(eq(patientMedications.patientId, patientId)),
      db.select().from(observations).where(eq(observations.patientId, patientId)),
      db
        .select()
        .from(clinicalDocuments)
        .where(eq(clinicalDocuments.patientId, patientId))
        .orderBy(desc(clinicalDocuments.indexedAt)),
      db.select().from(encounters).where(eq(encounters.patientId, patientId)),
      db
        .select()
        .from(clinicalNotes)
        .where(eq(clinicalNotes.patientId, patientId))
        .orderBy(desc(clinicalNotes.createdAt)),
      db
        .select({
          id: clinicalDrafts.id,
          title: clinicalDrafts.title,
          status: clinicalDrafts.status,
          draftType: clinicalDrafts.draftType,
          updatedAt: clinicalDrafts.updatedAt,
        })
        .from(clinicalDrafts)
        .where(eq(clinicalDrafts.patientId, patientId))
        .orderBy(desc(clinicalDrafts.updatedAt)),
    ]);

  const timeline = buildTimeline({
    encounters: encRows,
    notes: noteRows,
    observations: obsRows,
    documents: docRows,
    drafts: draftRows,
  });

  return {
    patientId,
    readOnly: true as const,
    demoCaseCode: demoCaseCode ?? undefined,
    problems: problemRows.map((p) => ({
      id: p.id,
      description: p.description,
      status: p.status,
    })),
    allergies: allergyRows.map((a) => ({
      id: a.id,
      substance: a.substance,
      severity: a.severity,
      status: a.status,
    })),
    medications: medRows.map((m) => ({
      id: m.id,
      name: m.name,
      doseText: m.doseText,
      route: m.route,
      status: m.status,
    })),
    observations: obsRows.map((o) => ({
      id: o.id,
      label: o.label,
      valueText: o.valueText,
      observedAt: o.observedAt.toISOString(),
    })),
    documents: docRows.map((d) => ({
      id: d.id,
      title: d.title,
      documentType: d.documentType,
      mimeType: d.mimeType,
      storageRef: d.storageRef,
      indexedAt: d.indexedAt.toISOString(),
    })),
    encounters: encRows.map((e) => ({
      id: e.id,
      status: e.status,
      startedAt: e.startedAt.toISOString(),
      endedAt: e.endedAt?.toISOString(),
    })),
    timeline: timeline.map((t) => ({
      id: t.id,
      kind: t.kind,
      at: t.at.toISOString(),
      title: t.title,
      detail: t.detail,
      entityId: t.entityId,
    })),
  };
}

export async function getPatientDashboardSummary(
  db: Database,
  patientId: string,
  displayName: string,
) {
  const longitudinal = await getPatientLongitudinal(db, patientId);
  const openStatuses = new Set(['draft', 'editing', 'ready_for_review']);

  const draftRows = await db
    .select({
      id: clinicalDrafts.id,
      title: clinicalDrafts.title,
      status: clinicalDrafts.status,
      draftType: clinicalDrafts.draftType,
    })
    .from(clinicalDrafts)
    .where(eq(clinicalDrafts.patientId, patientId));

  const pendingDrafts = draftRows.filter((d) => openStatuses.has(d.status));

  return {
    patientId,
    readOnly: true as const,
    displayName,
    demoCaseCode: longitudinal.demoCaseCode,
    activeProblems: longitudinal.problems
      .filter((p) => p.status === 'active')
      .map((p) => p.description),
    allergies: longitudinal.allergies,
    medications: longitudinal.medications.filter((m) => m.status === 'active'),
    recentObservations: longitudinal.observations.slice(0, 6),
    pendingDrafts,
    recentDocuments: longitudinal.documents.slice(0, 5),
    timelinePreview: longitudinal.timeline.slice(0, 8),
  };
}

function buildTimeline(input: {
  encounters: (typeof encounters.$inferSelect)[];
  notes: (typeof clinicalNotes.$inferSelect)[];
  observations: (typeof observations.$inferSelect)[];
  documents: (typeof clinicalDocuments.$inferSelect)[];
  drafts: {
    id: string;
    title: string;
    status: string;
    draftType: string;
    updatedAt: Date;
  }[];
}): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const e of input.encounters) {
    events.push({
      id: `enc-${e.id}`,
      kind: 'encounter',
      at: e.startedAt,
      title: e.status === 'open' ? 'Encuentro abierto' : 'Encuentro cerrado',
      detail: 'Episodio de atención (demo)',
      entityId: e.id,
    });
  }
  for (const n of input.notes) {
    events.push({
      id: `note-${n.id}`,
      kind: 'note',
      at: n.createdAt,
      title: n.title,
      detail: n.noteType,
      entityId: n.id,
    });
  }
  for (const o of input.observations) {
    events.push({
      id: `obs-${o.id}`,
      kind: 'observation',
      at: o.observedAt,
      title: o.label,
      detail: o.valueText,
      entityId: o.id,
    });
  }
  for (const d of input.documents) {
    events.push({
      id: `doc-${d.id}`,
      kind: 'document',
      at: d.indexedAt,
      title: d.title,
      detail: d.documentType,
      entityId: d.id,
    });
  }
  for (const d of input.drafts) {
    if (d.status === 'approved' || d.status === 'cancelled') continue;
    events.push({
      id: `draft-${d.id}`,
      kind: 'draft',
      at: d.updatedAt,
      title: d.title,
      detail: `${d.draftType} · ${d.status}`,
      entityId: d.id,
    });
  }

  return events.sort((a, b) => b.at.getTime() - a.at.getTime());
}
