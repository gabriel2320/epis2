/** Exportaciones sin React/MUI — uso en @epis2/api y scripts Node. */
export {
  createEpisSpellcheckAdapter,
  createLanguageToolAdapter,
} from './textbox/languageToolAdapter.js';
export {
  runClinicalSpellcheck,
  runLocalClinicalSpellcheck,
  simulatedLanguageToolAdapter,
  type ClinicalSpellIssue,
  type LanguageToolAdapter,
} from './textbox/clinicalSpellcheck.js';
export {
  clinicalTextOriginSchema,
  draftFieldTextBoxMetaEntrySchema,
  validateDraftBodyEpis2Meta,
} from './textbox/draftBodyMetaSchema.js';
