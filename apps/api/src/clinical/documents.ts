import { and, eq, ilike, or } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDocuments } from '../db/schema.js';

export async function searchPatientDocuments(
  db: Database,
  patientId: string,
  query: string,
) {
  const q = query.trim();
  if (!q) {
    return { patientId, query: q, hits: [] as Array<{
      id: string;
      title: string;
      documentType: string;
      storageRef: string;
      snippet: string;
    }> };
  }

  const pattern = `%${q.replace(/[%_]/g, '')}%`;
  const rows = await db
    .select()
    .from(clinicalDocuments)
    .where(
      and(
        eq(clinicalDocuments.patientId, patientId),
        or(
          ilike(clinicalDocuments.title, pattern),
          ilike(clinicalDocuments.storageRef, pattern),
        ),
      ),
    )
    .limit(20);

  return {
    patientId,
    query: q,
    hits: rows.map((d) => ({
      id: d.id,
      title: d.title,
      documentType: d.documentType,
      storageRef: d.storageRef,
      snippet: `${d.title} — ${d.storageRef}`,
    })),
  };
}
