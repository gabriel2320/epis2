import type { ClinicalIntent } from '@epis2/command-registry';

export type IntentChipTone =
  | 'ai'
  | 'search'
  | 'evolution'
  | 'discharge'
  | 'rx'
  | 'labs'
  | 'imaging'
  | 'nursing'
  | 'pharmacy'
  | 'dashboard';

export function getIntentChipTone(intent: ClinicalIntent, aiAssisted?: boolean): IntentChipTone {
  if (aiAssisted) return 'ai';
  if (intent.startsWith('open_dashboard')) return 'dashboard';
  switch (intent) {
    case 'search_patient':
    case 'open_patient_chart':
      return 'search';
    case 'summarize_patient':
      return 'ai';
    case 'create_evolution_draft':
      return 'evolution';
    case 'prepare_discharge_draft':
      return 'discharge';
    case 'prepare_prescription':
      return 'rx';
    case 'request_laboratory':
      return 'labs';
    case 'request_imaging':
    case 'request_referral':
      return 'imaging';
    case 'create_nursing_note':
    case 'record_medication_administration':
      return 'nursing';
    case 'prepare_pharmacy_review':
      return 'pharmacy';
    default:
      return 'evolution';
  }
}

export type RoleChipTone =
  | 'physician'
  | 'nurse'
  | 'paramedic'
  | 'kinesiologist'
  | 'pharmacist'
  | 'admin'
  | 'auditor'
  | 'default';

export type IntentSuggestionBadge = {
  labelKey: 'suggestionBadgePending' | 'suggestionBadgeImportant' | 'suggestionBadgeReview';
  tone: 'default' | 'success' | 'info' | 'warning';
};

export function getIntentSuggestionBadge(intent: ClinicalIntent): IntentSuggestionBadge {
  switch (intent) {
    case 'request_laboratory':
      return { labelKey: 'suggestionBadgeImportant', tone: 'success' };
    case 'prepare_pharmacy_review':
    case 'record_medication_administration':
      return { labelKey: 'suggestionBadgeReview', tone: 'warning' };
    case 'prepare_discharge_draft':
      return { labelKey: 'suggestionBadgePending', tone: 'info' };
    default:
      return { labelKey: 'suggestionBadgePending', tone: 'default' };
  }
}

export function getRoleChipTone(role: string): RoleChipTone {
  if (
    role === 'physician' ||
    role === 'nurse' ||
    role === 'paramedic' ||
    role === 'kinesiologist' ||
    role === 'pharmacist' ||
    role === 'admin' ||
    role === 'auditor'
  ) {
    return role;
  }
  return 'default';
}
