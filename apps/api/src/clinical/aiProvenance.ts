import {
  aiDocumentCitationsSchema,
  aiProvenanceRecordSchema,
  type AiProvenanceRecord,
} from '@epis2/contracts';

export type AiRunProvenanceRow = {
  id: string;
  blueprintId: string;
  model: string;
  promptHash: string;
  outputPayload?: unknown;
};

export type ApproveProvenanceContext = {
  aiRunId: string;
};

function readDocumentCitationsFromOutput(outputPayload: unknown) {
  if (!outputPayload || typeof outputPayload !== 'object') return undefined;
  const raw = outputPayload as Record<string, unknown>;
  if (raw.documentCitations === undefined) return undefined;
  const parsed = aiDocumentCitationsSchema.safeParse(raw.documentCitations);
  return parsed.success ? parsed.data : undefined;
}

export function buildAiProvenanceRecord(
  run: AiRunProvenanceRow,
  context: ApproveProvenanceContext,
): AiProvenanceRecord | null {
  if (run.id !== context.aiRunId) return null;

  const documentCitations = readDocumentCitationsFromOutput(run.outputPayload);

  const record = {
    aiRunId: run.id,
    blueprintId: run.blueprintId,
    model: run.model,
    promptHash: run.promptHash,
    ...(documentCitations !== undefined ? { documentCitations } : {}),
  };

  const parsed = aiProvenanceRecordSchema.safeParse(record);
  return parsed.success ? parsed.data : null;
}
