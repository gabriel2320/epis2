import {
  matchColloquialRule,
  shouldEscalateLexiconConfidence,
  type ClinicalIntent,
} from '@epis2/command-registry';
import { CLINICAL_LEXICON_ES_CL, type ClinicalLexiconEntry } from './buildLexicon.js';
import { normalizeClinicalSpanish } from './normalize.js';

export type LexiconResolveSource =
  | 'exact'
  | 'contains'
  | 'colloquial'
  | 'needs_clarification';

export type LexiconResolveResult = {
  intentId?: ClinicalIntent;
  confidence: number;
  source: LexiconResolveSource;
  matchedPhrase?: string;
  colloquialMessage?: string;
  candidates?: readonly ClinicalIntent[];
};

const byNormalized = new Map<string, ClinicalLexiconEntry>(
  CLINICAL_LEXICON_ES_CL.map((entry) => [entry.normalized, entry]),
);

function findContainsMatch(normalized: string): ClinicalLexiconEntry | undefined {
  if (byNormalized.has(normalized)) {
    return byNormalized.get(normalized);
  }
  let best: ClinicalLexiconEntry | undefined;
  for (const entry of CLINICAL_LEXICON_ES_CL) {
    if (entry.normalized.length < 4) continue;
    if (
      normalized.includes(entry.normalized) ||
      entry.normalized.includes(normalized)
    ) {
      if (!best || entry.confidence > best.confidence) {
        best = entry;
      }
    }
  }
  return best;
}

/**
 * Resuelve frase clínica ES-CL sin IA (MF-LX-02).
 * confidence >= 0.8 → acción resuelta · 0.5–0.79 → aclaración · < 0.5 → sin match
 */
export function resolveClinicalLexicon(raw: string): LexiconResolveResult {
  const normalized = normalizeClinicalSpanish(raw);
  if (!normalized) {
    return { confidence: 0, source: 'needs_clarification' };
  }

  const exact = byNormalized.get(normalized);
  if (exact) {
    return {
      intentId: exact.intentId,
      confidence: exact.confidence,
      source: 'exact',
      matchedPhrase: exact.phrase,
    };
  }

  const contains = findContainsMatch(normalized);
  if (contains && contains.confidence >= 0.85) {
    return {
      intentId: contains.intentId,
      confidence: Math.min(0.88, contains.confidence - 0.05),
      source: 'contains',
      matchedPhrase: contains.phrase,
    };
  }

  const colloquial = matchColloquialRule(normalized);
  if (colloquial) {
    const [primary, ...rest] = colloquial.intentHints;
    if (primary) {
      return {
        intentId: primary,
        confidence: 0.72,
        source: 'colloquial',
        colloquialMessage: colloquial.message,
        candidates: colloquial.intentHints,
      };
    }
    if (rest.length > 0) {
      return {
        confidence: 0.55,
        source: 'needs_clarification',
        colloquialMessage: colloquial.message,
        candidates: colloquial.intentHints,
      };
    }
  }

  if (contains) {
    return {
      intentId: contains.intentId,
      confidence: 0.65,
      source: 'contains',
      matchedPhrase: contains.phrase,
      candidates: [contains.intentId],
    };
  }

  return { confidence: 0.2, source: 'needs_clarification' };
}

/** Delega umbral canónico MF-LX-06 en command-registry. */
export function shouldEscalateToAi(result: LexiconResolveResult): boolean {
  return shouldEscalateLexiconConfidence(result.confidence);
}
