import type { ClinicalTextOrigin } from '../safety/textOrigin.js';

/** Clave meta en body de borrador — no es campo clínico SoT. */
export const EPIS2_DRAFT_TEXT_ORIGINS_KEY = '_epis2TextOrigins';

/** Meta completa ClinicalTextBox por campo — fase 4 MF-CLINICAL-TEXTBOX-TOOLS. */
export const EPIS2_DRAFT_TEXTBOX_META_KEY = '_epis2TextBoxMeta';

export type DraftFieldTextOrigins = Record<string, ClinicalTextOrigin>;

export type DraftFieldTextBoxMetaEntry = {
  origin: ClinicalTextOrigin;
  aiSuggestion?: boolean;
  pendingConfirmation?: 'medication' | 'dose' | 'unit' | 'allergy';
};

export type DraftFieldTextBoxMeta = Record<string, DraftFieldTextBoxMetaEntry>;

const PENDING_LABELS: Record<NonNullable<DraftFieldTextBoxMetaEntry['pendingConfirmation']>, string> = {
  medication: 'medicación',
  dose: 'dosis',
  unit: 'unidad',
  allergy: 'alergia',
};

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

function isDraftFieldTextBoxMetaEntry(value: unknown): value is DraftFieldTextBoxMetaEntry {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  if (!isClinicalTextOrigin(o.origin)) return false;
  if (o.aiSuggestion !== undefined && typeof o.aiSuggestion !== 'boolean') return false;
  if (
    o.pendingConfirmation !== undefined &&
    !['medication', 'dose', 'unit', 'allergy'].includes(String(o.pendingConfirmation))
  ) {
    return false;
  }
  return true;
}

export function fieldMetaFromOrigins(origins: DraftFieldTextOrigins): DraftFieldTextBoxMeta {
  return Object.fromEntries(
    Object.entries(origins).map(([fieldId, origin]) => [fieldId, { origin }]),
  );
}

export function extractTextBoxMetaFromDraftBody(
  body: Record<string, unknown>,
): DraftFieldTextBoxMeta {
  const raw = body[EPIS2_DRAFT_TEXTBOX_META_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: DraftFieldTextBoxMeta = {};
  for (const [fieldId, entry] of Object.entries(raw as Record<string, unknown>)) {
    if (isDraftFieldTextBoxMetaEntry(entry)) out[fieldId] = entry;
  }
  return out;
}

export function mergeDraftFieldMetaFromBody(body: Record<string, unknown>): DraftFieldTextBoxMeta {
  const meta = extractTextBoxMetaFromDraftBody(body);
  if (Object.keys(meta).length > 0) return meta;
  return fieldMetaFromOrigins(extractTextOriginsFromDraftBody(body));
}

export function attachClinicalTextBoxTraceToDraftBody(
  body: Record<string, unknown>,
  metaByField: DraftFieldTextBoxMeta,
): Record<string, unknown> {
  if (Object.keys(metaByField).length === 0) return body;
  const origins = Object.fromEntries(
    Object.entries(metaByField).map(([fieldId, entry]) => [fieldId, entry.origin]),
  );
  return {
    ...body,
    [EPIS2_DRAFT_TEXT_ORIGINS_KEY]: origins,
    [EPIS2_DRAFT_TEXTBOX_META_KEY]: metaByField,
  };
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
  return attachClinicalTextBoxTraceToDraftBody(body, fieldMetaFromOrigins(origins));
}

export function stripDraftMetaFromBody(body: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...body };
  delete rest[EPIS2_DRAFT_TEXT_ORIGINS_KEY];
  delete rest[EPIS2_DRAFT_TEXTBOX_META_KEY];
  return rest;
}

export function isDraftMetaFieldKey(key: string): boolean {
  return key.startsWith('_epis2');
}

export function draftHasReviewableTextOrigins(origins: DraftFieldTextOrigins): boolean {
  return Object.values(origins).some((o) => o.requiresHumanReview);
}

export function draftHasReviewableTextBoxMeta(meta: DraftFieldTextBoxMeta): boolean {
  return Object.values(meta).some((entry) => entry.origin.requiresHumanReview);
}

export function summarizeDraftTextOrigins(origins: DraftFieldTextOrigins): string[] {
  return Object.entries(origins)
    .filter(([, origin]) => origin.requiresHumanReview)
    .map(([fieldId, origin]) => `${fieldId}: ${origin.kind} · ${origin.label}`);
}

export function summarizeDraftTextBoxMeta(meta: DraftFieldTextBoxMeta): string[] {
  return Object.entries(meta)
    .filter(([, entry]) => entry.origin.requiresHumanReview)
    .map(([fieldId, entry]) => {
      const flags: string[] = [];
      if (entry.aiSuggestion) flags.push('IA');
      if (entry.pendingConfirmation) {
        flags.push(`pendiente ${PENDING_LABELS[entry.pendingConfirmation]}`);
      }
      const suffix = flags.length > 0 ? ` · ${flags.join(' · ')}` : '';
      return `${fieldId}: ${entry.origin.kind} · ${entry.origin.label}${suffix}`;
    });
}
