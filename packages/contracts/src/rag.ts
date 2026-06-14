import { z } from 'zod';

/** Dimensión objetivo pgvector RAG (MF-IM-01/02). */
export const RAG_EMBED_DIM = 384 as const;

/** Modelo Ollama por defecto para embeddings documentales. */
export const RAG_EMBED_MODEL_DEFAULT = 'nomic-embed-text';

export function poolEmbeddingVector(values: number[], targetDim: number): number[] {
  if (values.length === targetDim) return normalizeEmbeddingVector(values);
  const out = new Array<number>(targetDim).fill(0);
  for (let i = 0; i < values.length; i++) {
    out[i % targetDim]! += values[i]!;
  }
  return normalizeEmbeddingVector(out);
}

export function normalizeEmbeddingVector(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

export const embedDocumentRequestSchema = z.object({
  text: z.string().min(1).max(8000),
  model: z.string().min(1).optional(),
});

export const embedDocumentResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    embedding: z.array(z.number()).length(RAG_EMBED_DIM),
    dim: z.literal(RAG_EMBED_DIM),
    model: z.string(),
    provider: z.literal('ollama'),
    latencyMs: z.number().int().nonnegative(),
  }),
  z.object({
    status: z.literal('unavailable'),
    message: z.string(),
    provider: z.literal('ollama'),
  }),
]);

export type EmbedDocumentRequest = z.infer<typeof embedDocumentRequestSchema>;
export type EmbedDocumentResponse = z.infer<typeof embedDocumentResponseSchema>;

/** Cita documental trazable en assist (MF-IM-04). */
export const aiDocumentCitationSchema = z.object({
  documentId: z.string().uuid(),
  chunkIndex: z.number().int().nonnegative(),
});

export const aiDocumentCitationsSchema = z.array(aiDocumentCitationSchema).max(8);

export type AiDocumentCitation = z.infer<typeof aiDocumentCitationSchema>;

/** Payload parcial persistido en ai_runs.output_payload. */
export const aiRunDocumentCitationsPayloadSchema = z.object({
  documentCitations: aiDocumentCitationsSchema,
});

export type AiRunDocumentCitationsPayload = z.infer<typeof aiRunDocumentCitationsPayloadSchema>;
