import type { ClinicalTextOrigin } from '../safety/textOrigin.js';

/** Clave meta en body de borrador — no es campo clínico SoT. */
export const EPIS2_DRAFT_TEXT_ORIGINS_KEY = '_epis2TextOrigins';

export type DraftFieldTextOrigins = Record<string, ClinicalTextOrigin>;

function isClinicalTextOrigin(value: unknown): value is ClinicalTextOrigin {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.kind === 'string' &&
    typeof o.label === 'string' &&
    typeof o.at === 'string' &&
    typeof o.requiresHumanReview === 'boolean'
  );
}

export function extractTextOriginsFromDraftBody(
  body: Record<string, unknown>,
): DraftFieldTextOrigins {
  const raw = body[EPIS2_DRAFT_TEXT_ORIGINS_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: DraftFieldTextOrigins = {};
  for (const [fieldId, origin] of Object.entries(raw as Record<string, unknown>)) {
    if (isClinicalTextOrigin(origin)) out[fieldId] = origin;
  }
  return out;
}

export function attachTextOriginsToDraftBody(
  body: Record<string, unknown>,
  origins: DraftFieldTextOrigins,
): Record<string, unknown> {
  if (Object.keys(origins).length === 0) return body;
  return { ...body, [EPIS2_DRAFT_TEXT_ORIGINS_KEY]: origins };
}

export function stripDraftMetaFromBody(body: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...body };
  delete rest[EPIS2_DRAFT_TEXT_ORIGINS_KEY];
  return rest;
}

export function isDraftMetaFieldKey(key: string): boolean {
  return key.startsWith('_epis2');
}

export function draftHasReviewableTextOrigins(origins: DraftFieldTextOrigins): boolean {
  return Object.values(origins).some((o) => o.requiresHumanReview);
}

export function summarizeDraftTextOrigins(origins: DraftFieldTextOrigins): string[] {
  return Object.entries(origins)
    .filter(([, origin]) => origin.requiresHumanReview)
    .map(([fieldId, origin]) => `${fieldId}: ${origin.kind} · ${origin.label}`);
}
