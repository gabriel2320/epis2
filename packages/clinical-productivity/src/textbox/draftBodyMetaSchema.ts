import { z } from 'zod';
import {
  EPIS2_DRAFT_TEXTBOX_META_KEY,
  EPIS2_DRAFT_TEXT_ORIGINS_KEY,
  type DraftFieldTextBoxMeta,
  type DraftFieldTextOrigins,
} from './draftTextOrigins.js';

const clinicalTextOriginKindSchema = z.enum([
  'manual',
  'snippet',
  'paste',
  'ai_suggestion',
  'ocr',
  'dictation',
  'autocomplete',
]);

export const clinicalTextOriginSchema = z.object({
  kind: clinicalTextOriginKindSchema,
  label: z.string().min(1).max(240),
  at: z.string().min(1).max(64),
  userId: z.string().min(1).max(128).optional(),
  requiresHumanReview: z.boolean(),
});

export const draftFieldTextBoxMetaEntrySchema = z.object({
  origin: clinicalTextOriginSchema,
  aiSuggestion: z.boolean().optional(),
  pendingConfirmation: z.enum(['medication', 'dose', 'unit', 'allergy']).optional(),
});

const draftFieldTextOriginsSchema = z.record(z.string().min(1).max(80), clinicalTextOriginSchema);
const draftFieldTextBoxMetaSchema = z.record(
  z.string().min(1).max(80),
  draftFieldTextBoxMetaEntrySchema,
);

const ALLOWED_EPIS2_META_KEYS = new Set([
  EPIS2_DRAFT_TEXT_ORIGINS_KEY,
  EPIS2_DRAFT_TEXTBOX_META_KEY,
]);

function originMatches(
  a: z.infer<typeof clinicalTextOriginSchema>,
  b: z.infer<typeof clinicalTextOriginSchema>,
) {
  return (
    a.kind === b.kind &&
    a.label === b.label &&
    a.at === b.at &&
    a.requiresHumanReview === b.requiresHumanReview &&
    a.userId === b.userId
  );
}

export type ValidateDraftBodyEpis2MetaResult =
  | { success: true; body: Record<string, unknown> }
  | { success: false; error: string };

/** Valida y normaliza meta `_epis2` en body de borrador — fail-closed ante claves o formas inválidas. */
export function validateDraftBodyEpis2Meta(
  body: Record<string, unknown>,
): ValidateDraftBodyEpis2MetaResult {
  const unknownKeys = Object.keys(body).filter(
    (key) => key.startsWith('_epis2') && !ALLOWED_EPIS2_META_KEYS.has(key),
  );
  if (unknownKeys.length > 0) {
    return {
      success: false,
      error: `Claves meta EPIS2 no permitidas: ${unknownKeys.join(', ')}`,
    };
  }

  const rawOrigins = body[EPIS2_DRAFT_TEXT_ORIGINS_KEY];
  const rawMeta = body[EPIS2_DRAFT_TEXTBOX_META_KEY];

  let origins: DraftFieldTextOrigins | undefined;
  if (rawOrigins !== undefined) {
    const parsed = draftFieldTextOriginsSchema.safeParse(rawOrigins);
    if (!parsed.success) {
      return { success: false, error: 'Meta _epis2TextOrigins inválida' };
    }
    origins = parsed.data as DraftFieldTextOrigins;
  }

  let meta: DraftFieldTextBoxMeta | undefined;
  if (rawMeta !== undefined) {
    const parsed = draftFieldTextBoxMetaSchema.safeParse(rawMeta);
    if (!parsed.success) {
      return { success: false, error: 'Meta _epis2TextBoxMeta inválida' };
    }
    meta = parsed.data as DraftFieldTextBoxMeta;
  }

  if (origins && meta) {
    for (const [fieldId, entry] of Object.entries(meta)) {
      const origin = origins[fieldId];
      if (!origin || !originMatches(origin, entry.origin)) {
        return {
          success: false,
          error: `Origen inconsistente para campo ${fieldId} entre _epis2TextOrigins y _epis2TextBoxMeta`,
        };
      }
    }
  }

  const next: Record<string, unknown> = { ...body };

  if (meta && Object.keys(meta).length > 0) {
    next[EPIS2_DRAFT_TEXTBOX_META_KEY] = meta;
    next[EPIS2_DRAFT_TEXT_ORIGINS_KEY] = Object.fromEntries(
      Object.entries(meta).map(([fieldId, entry]) => [fieldId, entry.origin]),
    );
  } else if (origins && Object.keys(origins).length > 0) {
    next[EPIS2_DRAFT_TEXT_ORIGINS_KEY] = origins;
    delete next[EPIS2_DRAFT_TEXTBOX_META_KEY];
  } else {
    delete next[EPIS2_DRAFT_TEXT_ORIGINS_KEY];
    delete next[EPIS2_DRAFT_TEXTBOX_META_KEY];
  }

  return { success: true, body: next };
}
