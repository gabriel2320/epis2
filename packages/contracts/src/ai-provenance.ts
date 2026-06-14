import { z } from 'zod';
import { aiDocumentCitationsSchema } from './rag.js';

/** Registro interno de proveniencia IA en aprobación asistida (MF-IM-05). */
export const aiProvenanceRecordSchema = z.object({
  aiRunId: z.string().uuid(),
  blueprintId: z.string().min(1),
  model: z.string().min(1),
  promptHash: z.string().min(1),
  documentCitations: aiDocumentCitationsSchema.optional(),
});

export type AiProvenanceRecord = z.infer<typeof aiProvenanceRecordSchema>;
