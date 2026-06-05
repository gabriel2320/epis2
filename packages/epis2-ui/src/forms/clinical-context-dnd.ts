export const CLINICAL_CONTEXT_DRAG_MIME = 'application/x-epis2-clinical-context';

export type ClinicalContextDragPayload = {
  text: string;
  sourceEventId: string;
};

export function serializeClinicalContextDrag(payload: ClinicalContextDragPayload): string {
  return JSON.stringify(payload);
}

export function parseClinicalContextDrag(data: string): ClinicalContextDragPayload | null {
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as Partial<ClinicalContextDragPayload>;
    if (
      typeof parsed.text === 'string' &&
      parsed.text.trim().length > 0 &&
      typeof parsed.sourceEventId === 'string' &&
      parsed.sourceEventId.length > 0
    ) {
      return { text: parsed.text, sourceEventId: parsed.sourceEventId };
    }
  } catch {
    return null;
  }
  return null;
}
