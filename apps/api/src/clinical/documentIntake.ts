import { sql } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDocuments } from '../db/schema.js';
import {
  chunkText,
  demoEmbedText,
  demoEmbedToPgVectorLiteral,
} from './embeddings.js';

export type DocumentIntakeInput = {
  title: string;
  documentType: 'pdf' | 'txt' | 'image' | 'referral' | 'lab_report' | 'other';
  mimeType?: string | undefined;
  textContent?: string | undefined;
  filename?: string | undefined;
};

export async function intakePatientDocument(
  db: Database,
  patientId: string,
  actorId: string,
  input: DocumentIntakeInput,
) {
  const rawText = input.textContent?.trim() ?? '';
  const needsOcr =
    !rawText && (input.documentType === 'image' || input.documentType === 'pdf');
  const textContent = needsOcr
    ? `[OCR pendiente — demo] ${input.title}`
    : rawText || input.title;
  const intakeStatus = needsOcr ? 'ocr_pending' : 'indexed';
  const storageRef = input.filename
    ? `demo://intake/${patientId}/${input.filename}`
    : `demo://intake/${patientId}/${Date.now()}`;

  const [doc] = await db
    .insert(clinicalDocuments)
    .values({
      patientId,
      title: input.title,
      documentType: input.documentType,
      mimeType: input.mimeType ?? null,
      storageRef,
      status: 'indexed',
      textContent,
      intakeStatus,
      createdBy: actorId,
    })
    .returning();

  if (!doc) {
    throw new Error('No se pudo registrar el documento');
  }

  const chunks = chunkText(textContent);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const embedding = demoEmbedToPgVectorLiteral(demoEmbedText(chunk));
    await db.execute(sql`
      INSERT INTO clinical_document_chunks (document_id, patient_id, chunk_index, chunk_text, embedding)
      VALUES (
        ${doc.id}::uuid,
        ${patientId}::uuid,
        ${i},
        ${chunk},
        ${embedding}::vector
      )
    `);
  }

  return {
    document: {
      id: doc.id,
      title: doc.title,
      documentType: doc.documentType,
      mimeType: doc.mimeType,
      storageRef: doc.storageRef,
      intakeStatus,
      chunkCount: chunks.length,
      requiresHumanReview: true as const,
      ocrPending: needsOcr,
    },
  };
}
