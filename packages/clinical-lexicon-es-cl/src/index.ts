export { CLINICAL_ABBREVIATIONS_ES_CL } from './abbreviations.js';
export {
  buildClinicalLexiconEsCl,
  CLINICAL_LEXICON_ES_CL,
  type ClinicalLexiconEntry,
  type LexiconSource,
} from './buildLexicon.js';
export { normalizeClinicalSpanish } from './normalize.js';
export {
  resolveClinicalLexicon,
  shouldEscalateToAi,
  type LexiconResolveResult,
  type LexiconResolveSource,
} from './resolve.js';
