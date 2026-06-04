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
