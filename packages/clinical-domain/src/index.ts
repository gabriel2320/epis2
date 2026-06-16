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
  DEMO_IDENTIFIER_SYSTEM,
  SIM_IDENTIFIER_SYSTEM,
  SYNTHETIC_LABEL,
} from './syntheticIdentifiers.js';
export { stableSimCaseUuids } from './stableSimCaseUuids.js';
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
  EPIS2_MINSAL_FHIR_BASE,
  MINSAL_IDENTIFIER_TYPE_SYSTEM,
  MINSAL_NID_IG_BASE,
  MINSAL_PROFILES,
  buildMinsalIdentifierCoding,
  mapPatientIdentifierToFhir,
  type MinsalIdentifierCoding,
  type MinsalPatientIdentifierFhir,
} from './chile/minsalProfiles.js';
export {
  CHILE_REGISTRY_META_ALLOWLIST,
  CHILE_RUT_REGISTRY_META_KEYS,
  CHILE_SNRE_REGISTRY_META_KEYS,
  CHILE_SUMMARY_REGISTRY_META_KEYS,
  isChileRegistryMetaKey,
  type ChileRegistryMetaKey,
  type ChileRutRegistryMetaKey,
  type ChileSnreRegistryMetaKey,
  type ChileSummaryRegistryMetaKey,
} from './chile/registry-meta-allowlist.js';
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
  mapClinicalAlertsToPatientViewCards,
  type PatientViewCdsCard,
} from './cdsHooks/mapClinicalAlertsToPatientViewCards.js';
export {
  mapClinicalAlertsToOrderSelectCards,
  type OrderSelectCdsCard,
} from './cdsHooks/mapClinicalAlertsToOrderSelectCards.js';
export { type CdsHookId } from './cdsHooks/types.js';
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
