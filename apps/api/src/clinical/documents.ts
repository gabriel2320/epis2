import { and, eq, ilike, or, sql } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDocuments } from '../db/schema.js';
import { demoEmbedText, demoEmbedText384, demoEmbedToPgVectorLiteral } from './embeddings.js';

export type DocumentSearchHit = {
  id: string;
  title: string;
  documentType: string;
  storageRef: string;
  snippet: string;
  embedDim?: 128 | 384;
};

type SemanticSearchHit = DocumentSearchHit & { searchMode: 'semantic' };

export async function searchPatientDocuments(
  db: Database,
  patientId: string,
  query: string,
): Promise<{
  patientId: string;
  query: string;
  searchMode: 'semantic' | 'keyword';
  hits: DocumentSearchHit[];
}> {
  const q = query.trim();
  if (!q) {
    return { patientId, query: q, searchMode: 'keyword', hits: [] };
  }

  const semanticHits = await semanticDocumentSearch(db, patientId, q);
  if (semanticHits.length > 0) {
    return {
      patientId,
      query: q,
      searchMode: 'semantic',
      hits: semanticHits.map(({ searchMode: _mode, ...hit }) => hit),
    };
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
          ilike(clinicalDocuments.textContent, pattern),
        ),
      ),
    )
    .limit(20);

  return {
    patientId,
    query: q,
    searchMode: 'keyword',
    hits: rows.map((d) => ({
      id: d.id,
      title: d.title,
      documentType: d.documentType,
      storageRef: d.storageRef,
      snippet: d.textContent?.slice(0, 160) ?? `${d.title} — ${d.storageRef}`,
    })),
  };
}

async function semanticDocumentSearch(
  db: Database,
  patientId: string,
  query: string,
): Promise<SemanticSearchHit[]> {
  const hits384 = await semanticDocumentSearchWithDim(db, patientId, query, 384);
  if (hits384.length > 0) return hits384;
  return semanticDocumentSearchWithDim(db, patientId, query, 128);
}

async function semanticDocumentSearchWithDim(
  db: Database,
  patientId: string,
  query: string,
  dim: 128 | 384,
): Promise<SemanticSearchHit[]> {
  try {
    const embedding =
      dim === 384
        ? demoEmbedToPgVectorLiteral(demoEmbedText384(query))
        : demoEmbedToPgVectorLiteral(demoEmbedText(query));

    const rows =
      dim === 384
        ? await db.execute<{
            document_id: string;
            title: string;
            document_type: string;
            storage_ref: string;
            chunk_text: string;
            distance: number;
          }>(sql`
            SELECT
              c.document_id,
              d.title,
              d.document_type,
              d.storage_ref,
              c.chunk_text,
              (c.embedding_384 <=> ${embedding}::vector) AS distance
            FROM clinical_document_chunks c
            INNER JOIN clinical_documents d ON d.id = c.document_id
            WHERE c.patient_id = ${patientId}::uuid
              AND c.embedding_384 IS NOT NULL
            ORDER BY c.embedding_384 <=> ${embedding}::vector
            LIMIT 10
          `)
        : await db.execute<{
            document_id: string;
            title: string;
            document_type: string;
            storage_ref: string;
            chunk_text: string;
            distance: number;
          }>(sql`
            SELECT
              c.document_id,
              d.title,
              d.document_type,
              d.storage_ref,
              c.chunk_text,
              (c.embedding <=> ${embedding}::vector) AS distance
            FROM clinical_document_chunks c
            INNER JOIN clinical_documents d ON d.id = c.document_id
            WHERE c.patient_id = ${patientId}::uuid
              AND c.embedding IS NOT NULL
            ORDER BY c.embedding <=> ${embedding}::vector
            LIMIT 10
          `);

    const seen = new Set<string>();
    const hits: SemanticSearchHit[] = [];
    for (const row of rows) {
      if (seen.has(row.document_id)) continue;
      if (row.distance > 0.85) continue;
      seen.add(row.document_id);
      hits.push({
        id: row.document_id,
        title: row.title,
        documentType: row.document_type,
        storageRef: row.storage_ref,
        snippet: row.chunk_text.slice(0, 200),
        embedDim: dim,
        searchMode: 'semantic',
      });
    }
    return hits;
  } catch {
    return [];
  }
}
