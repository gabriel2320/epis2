import type { ClinicalAlert } from '@epis2/contracts';
import type { SilentSuggestionVariant } from '../silentSuggestions/buildSilentSuggestions.js';
import type { CdsHookId } from './types.js';

export type { CdsHookId } from './types.js';

export type PatientViewCdsCard = {
  id: string;
  variant: SilentSuggestionVariant;
  label: string;
  detail?: string | undefined;
  hook: CdsHookId;
  ruleId: string;
  source?: ClinicalAlert['source'] | undefined;
};

const ALLERGY_RULE_IDS = new Set([
  'beta-lactam-cross-reactivity',
  'allergy_medication_conflict',
  'cdr.prescription_allergy_conflict',
  'cdr.allergy_medication_conflict',
]);

const GAP_RULE_IDS = new Set([
  'medication_reconciliation_gap',
  'cdr.critical_lab_without_ack',
  'critical_lab_without_ack',
  'renal-dose-adjustment',
  'duplicate_medication_order',
  'cdr.duplicate_medication_order',
]);

function normalizeRuleId(ruleId: string): string {
  return ruleId.replace(/^cdr\./, '');
}

function isAllergyRule(ruleId: string): boolean {
  const base = normalizeRuleId(ruleId);
  return ALLERGY_RULE_IDS.has(ruleId) || ALLERGY_RULE_IDS.has(base) || /allergy|beta-lactam/i.test(base);
}

function isGapRule(ruleId: string): boolean {
  const base = normalizeRuleId(ruleId);
  return GAP_RULE_IDS.has(ruleId) || GAP_RULE_IDS.has(base) || /gap|reconciliation|duplicate/i.test(base);
}

function mapSeverityToVariant(alert: ClinicalAlert): SilentSuggestionVariant {
  if (alert.severity === 'critical') return 'warning';
  if (isAllergyRule(alert.ruleId) || isGapRule(alert.ruleId)) return 'suggestion';
  return 'info';
}

/** MF-CU-02 — CDS Hooks patient-view: alertas clínicas → tarjetas compactas al abrir ficha. */
export function mapClinicalAlertsToPatientViewCards(
  alerts: readonly ClinicalAlert[],
): PatientViewCdsCard[] {
  const seen = new Set<string>();

  return alerts
    .map((alert) => {
      const id = `patient-view-${alert.ruleId}`;
      if (seen.has(id)) return null;
      seen.add(id);

      const card: PatientViewCdsCard = {
        id,
        variant: mapSeverityToVariant(alert),
        label: alert.message,
        hook: 'patient-view',
        ruleId: alert.ruleId,
        source: alert.source,
      };
      if (alert.detail.trim()) card.detail = alert.detail;
      return card;
    })
    .filter((card): card is PatientViewCdsCard => card !== null);
}
