export {
  formatSurgicalHistoryDescription,
  isSurgicalHistoryDescription,
  stripSurgicalHistoryPrefix,
  SURGICAL_HISTORY_DESCRIPTION_PREFIX,
} from './surgicalHistory.js';
export { CLINICAL_ROLES, isClinicalRole, type ClinicalRole } from './roles.js';
export { PERMISSIONS, isPermission, type Permission } from './permissions.js';
export {
  ROLE_PERMISSIONS,
  permissionsForRole,
  roleHasPermission,
  assertPermission,
} from './rbac.js';
export {
  SYNTHETIC_USERS,
  findSyntheticUser,
  verifyDemoAuthKey,
  type SyntheticUser,
} from './demoUsers.js';
export {
  DRAFT_STATUSES,
  DRAFT_PATCH_TRANSITIONS,
  assertPatchDraftStatus,
  canPatchDraftStatus,
  isDraftStatus,
  sanitizeAiSuggestedFields,
  type DraftStatus,
} from './draftStates.js';
export { CHILE_RUT_IDENTIFIER_SYSTEM } from './chile/constants.js';
export {
  CHILE_PATIENT_IDENTIFIER_TYPES,
  DEFAULT_RUN_IDENTIFIER_TYPE,
  isChilePatientIdentifierType,
  type ChilePatientIdentifierType,
} from './chile/identifier-types.js';
export { parseRutParts, type RutParts } from './chile/rut-parts.js';
export {
  cleanRutInput,
  computeRutVerifier,
  formatRut,
  normalizeRut,
  validateRut,
  isValidRut,
  rutMatchesPattern,
  type RutValidationResult,
} from './chile/rut.js';
export {
  evaluateClinicalSafety,
  formatSafetyWarningsForAssist,
} from './clinicalSafety/evaluate.js';
export { evaluateDemoClinicalAlerts } from './clinicalDecisionRules/evaluate.js';
export {
  evaluateClinicalDecisionRules,
  evaluatePrescriptionAllergyConflict,
  evaluateDuplicateMedicationOrder,
  HIGH_RISK_DRUG_PATTERNS,
} from './clinicalDecisionRules/rules.js';
export { CDR_RULE_IDS } from './clinicalDecisionRules/types.js';
export {
  buildCdrContextFromSafetyInput,
  mapBlueprintToCdrActionId,
} from './clinicalDecisionRules/fromSafetyInput.js';
export { cdrResultsToSafetyWarnings } from './clinicalDecisionRules/toSafetyWarnings.js';
export type { CdrContext, CdrCheckResult, CdrRuleId } from './clinicalDecisionRules/types.js';
export { buildClinicalSafetyInputFromSummary } from './clinicalSafety/fromDemoContext.js';
export {
  checkBetaLactamAllergy,
  checkAceInhibitorInPregnancy,
  checkRenalDoseAdjustment,
  SAFETY_RULE_IDS,
} from './clinicalSafety/rules.js';
export type {
  ClinicalSafetyInput,
  ClinicalSafetyResult,
  SafetyWarning,
  SafetyMedication,
  SafetyAllergy,
  SafetyLab,
} from './clinicalSafety/types.js';
export {
  buildClinicalContextDense,
  formatRelativeClinicalAgeEs,
  selectContextDenseLabHighlights,
  type ClinicalContextDenseLabHighlight,
  type ClinicalContextDensePayload,
} from './clinicalContextDense.js';
export {
  buildSilentClinicalSuggestions,
  SILENT_SUGGESTIONS_MAX_VISIBLE,
  type BuildSilentSuggestionsInput,
  type SilentClinicalSuggestion,
  type SilentSuggestionVariant,
} from './silentSuggestions/buildSilentSuggestions.js';
export {
  bumpUsageCount,
  INSTITUTIONAL_DIAGNOSIS_PHRASE_WEIGHTS,
  INSTITUTIONAL_LAB_PHRASE_WEIGHTS,
  INSTITUTIONAL_MEDICATION_WEIGHTS,
  rankAutocompletePhrases,
  rankCatalogEntries,
  type CatalogUsageDomain,
  type RankCatalogEntryInput,
} from './catalogFrequencyRank.js';
export {
  detectClinicalComorbiditySignals,
  type ClinicalComorbiditySignals,
} from './comorbiditySignals.js';
