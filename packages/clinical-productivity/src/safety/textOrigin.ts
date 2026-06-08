/** Origen de texto clínico — trazabilidad mínima (borrador editable). */
export type ClinicalTextOriginKind =
  | 'manual'
  | 'snippet'
  | 'paste'
  | 'ai_suggestion'
  | 'ocr'
  | 'dictation'
  | 'autocomplete';

export type ClinicalTextOrigin = {
  kind: ClinicalTextOriginKind;
  label: string;
  at: string;
  userId?: string;
  requiresHumanReview: boolean;
};

export function originRequiresReview(kind: ClinicalTextOriginKind): boolean {
  return kind !== 'manual';
}

export function createTextOrigin(
  kind: ClinicalTextOriginKind,
  label: string,
  userId?: string,
): ClinicalTextOrigin {
  return {
    kind,
    label,
    at: new Date().toISOString(),
    ...(userId ? { userId } : {}),
    requiresHumanReview: originRequiresReview(kind),
  };
}

/** Nunca firmar automáticamente contenido con origen revisable. */
export function mayAutoSign(_origin: ClinicalTextOrigin): boolean {
  return false;
}
