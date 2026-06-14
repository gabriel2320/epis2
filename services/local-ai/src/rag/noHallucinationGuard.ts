import type { RetrievedChunk } from './types.js';

const STOPWORDS = new Set([
  'de',
  'la',
  'el',
  'en',
  'y',
  'a',
  'con',
  'sin',
  'para',
  'por',
  'demo',
  'paciente',
  'nota',
  'borrador',
]);

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function tokenize(text: string): string[] {
  return normalizeForMatch(text)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 5 && !STOPWORDS.has(token));
}

/**
 * Eval no-hallucination (MF-IM-04): términos clínicos largos deben aparecer en chunks citados.
 */
export function assertSuggestedFieldsGrounded(
  suggestedFields: Record<string, string>,
  retrievedChunks: readonly Pick<RetrievedChunk, 'chunkText'>[],
): { ok: true } | { ok: false; term: string } {
  const corpus = normalizeForMatch(retrievedChunks.map((c) => c.chunkText).join(' '));
  const combined = Object.values(suggestedFields).join(' ');
  const terms = [...new Set(tokenize(combined))];

  for (const term of terms) {
    if (!corpus.includes(term)) {
      return { ok: false, term };
    }
  }

  return { ok: true };
}
