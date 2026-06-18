import { CLINICAL_ACTION_MANIFEST, type ClinicalIntent } from '@epis2/command-registry';
import { CLINICAL_ABBREVIATIONS_ES_CL } from './abbreviations.js';
import { normalizeClinicalSpanish } from './normalize.js';

export type LexiconSource = 'label' | 'synonym' | 'abbreviation';

export type ClinicalLexiconEntry = {
  phrase: string;
  normalized: string;
  intentId: ClinicalIntent;
  source: LexiconSource;
  /** Confianza determinista 0–1 (sin IA). */
  confidence: number;
};

function pushUnique(bucket: Map<string, ClinicalLexiconEntry>, entry: ClinicalLexiconEntry): void {
  const existing = bucket.get(entry.normalized);
  if (!existing || entry.confidence > existing.confidence) {
    bucket.set(entry.normalized, entry);
  }
}

/** Construye lexicon ES-CL desde manifest + abreviaturas (MF-LX-02). */
export function buildClinicalLexiconEsCl(): readonly ClinicalLexiconEntry[] {
  const bucket = new Map<string, ClinicalLexiconEntry>();

  for (const action of CLINICAL_ACTION_MANIFEST) {
    pushUnique(bucket, {
      phrase: action.label,
      normalized: normalizeClinicalSpanish(action.label),
      intentId: action.id,
      source: 'label',
      confidence: 1,
    });
    for (const synonym of action.synonyms) {
      pushUnique(bucket, {
        phrase: synonym,
        normalized: normalizeClinicalSpanish(synonym),
        intentId: action.id,
        source: 'synonym',
        confidence: 0.92,
      });
    }
  }

  for (const [abbrev, intentId] of Object.entries(CLINICAL_ABBREVIATIONS_ES_CL)) {
    pushUnique(bucket, {
      phrase: abbrev,
      normalized: normalizeClinicalSpanish(abbrev),
      intentId,
      source: 'abbreviation',
      confidence: 0.85,
    });
  }

  return [...bucket.values()].sort((a, b) => a.normalized.localeCompare(b.normalized));
}

export const CLINICAL_LEXICON_ES_CL: readonly ClinicalLexiconEntry[] = buildClinicalLexiconEsCl();
