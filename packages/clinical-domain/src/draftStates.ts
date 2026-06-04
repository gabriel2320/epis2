/** Estados de borrador clínico — aprobación solo vía endpoint humano (EPIS2-08). */
export const DRAFT_STATUSES = [
  'draft',
  'editing',
  'ready_for_review',
  'rejected',
  'cancelled',
  'approved',
] as const;

export type DraftStatus = (typeof DRAFT_STATUSES)[number];

/** Transiciones permitidas por PATCH (nunca incluye `approved`). */
export const DRAFT_PATCH_TRANSITIONS: Record<
  Exclude<DraftStatus, 'approved'>,
  readonly DraftStatus[]
> = {
  draft: ['editing', 'ready_for_review', 'cancelled'],
  editing: ['draft', 'ready_for_review', 'cancelled'],
  ready_for_review: ['editing', 'rejected', 'cancelled'],
  rejected: ['editing', 'cancelled'],
  cancelled: [],
};

export function isDraftStatus(value: string): value is DraftStatus {
  return (DRAFT_STATUSES as readonly string[]).includes(value);
}

export function canPatchDraftStatus(from: string, to: string): boolean {
  if (to === 'approved') return false;
  if (!isDraftStatus(from) || !isDraftStatus(to)) return false;
  if (from === 'approved' || from === 'cancelled') return false;
  const allowed = DRAFT_PATCH_TRANSITIONS[from as Exclude<DraftStatus, 'approved'>];
  return (allowed as readonly string[]).includes(to);
}

export function assertPatchDraftStatus(from: string, to: string): void {
  if (!canPatchDraftStatus(from, to)) {
    throw new Error(`Transición de estado no permitida: ${from} → ${to}`);
  }
}

/** Campos que la IA no puede inyectar en formularios/borradores. */
export const AI_BLOCKED_FIELD_KEYS = /^status$|^approve|^approved$|^firma$/i;

export function sanitizeAiSuggestedFields(
  fields: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fields).filter(([key]) => !AI_BLOCKED_FIELD_KEYS.test(key)),
  );
}
