import { eq, sql } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDocuments } from '../db/schema.js';
import { chunkText, demoEmbedToPgVectorLiteral, resolveChunkEmbeddings } from './embeddings.js';
import { extractDemoOcrText } from './ocrDemo.js';

export async function processDocumentOcr(db: Database, documentId: string, ollamaBaseUrl?: string) {
  const [doc] = await db
    .select()
    .from(clinicalDocuments)
    .where(eq(clinicalDocuments.id, documentId))
    .limit(1);

  if (!doc) return null;
  if (doc.intakeStatus !== 'ocr_pending' && doc.intakeStatus !== 'staged') {
    return { documentId, skipped: true as const, reason: 'not_pending' as const };
  }

  const ocr = extractDemoOcrText({
    mimeType: doc.mimeType,
    textContent: doc.textContent,
    title: doc.title,
  });

  await db
    .update(clinicalDocuments)
    .set({ textContent: ocr.text, intakeStatus: 'indexed' })
    .where(eq(clinicalDocuments.id, documentId));

  await db.execute(sql`
    DELETE FROM clinical_document_chunks WHERE document_id = ${documentId}::uuid
  `);

  const chunks = chunkText(ocr.text);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const { dim128, dim384 } = await resolveChunkEmbeddings(chunk, ollamaBaseUrl);
    const embedding128 = demoEmbedToPgVectorLiteral(dim128);
    const embedding384 = demoEmbedToPgVectorLiteral(dim384);
    await db.execute(sql`
      INSERT INTO clinical_document_chunks (
        document_id, patient_id, chunk_index, chunk_text, embedding, embedding_384
      )
      VALUES (
        ${documentId}::uuid,
        ${doc.patientId}::uuid,
        ${i},
        ${chunk},
        ${embedding128}::vector,
        ${embedding384}::vector
      )
    `);
  }

  return {
    documentId,
    patientId: doc.patientId,
    ocrMode: ocr.mode,
    chunkCount: chunks.length,
    requiresHumanReview: true as const,
  };
}
