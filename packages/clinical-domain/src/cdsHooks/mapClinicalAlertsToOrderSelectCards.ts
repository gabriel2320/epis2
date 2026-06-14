import type { ClinicalAlert } from '@epis2/contracts';
import type { SilentSuggestionVariant } from '../silentSuggestions/buildSilentSuggestions.js';
import type { CdsHookId } from './types.js';

export type OrderSelectCdsCard = {
  id: string;
  variant: SilentSuggestionVariant;
  label: string;
  detail?: string | undefined;
  hook: CdsHookId;
  ruleId: string;
  source?: ClinicalAlert['source'] | undefined;
};

const DUPLICATE_RULE_IDS = new Set([
  'duplicate_medication_order',
  'cdr.duplicate_medication_order',
]);

const PRESCRIPTION_ALLERGY_RULE_IDS = new Set([
  'prescription_allergy_conflict',
  'allergy_medication_conflict',
  'cdr.prescription_allergy_conflict',
  'cdr.allergy_medication_conflict',
]);

const INTERACTION_RULE_IDS = new Set([
  'beta-lactam-cross-reactivity',
  'ace-inhibitor-pregnancy',
  'renal-dose-adjustment',
]);

function normalizeRuleId(ruleId: string): string {
  return ruleId.replace(/^cdr\./, '');
}

function isDuplicateRule(ruleId: string): boolean {
  const base = normalizeRuleId(ruleId);
  return DUPLICATE_RULE_IDS.has(ruleId) || DUPLICATE_RULE_IDS.has(base) || /duplicate/i.test(base);
}

function isPrescriptionAllergyRule(ruleId: string): boolean {
  const base = normalizeRuleId(ruleId);
  return (
    PRESCRIPTION_ALLERGY_RULE_IDS.has(ruleId) ||
    PRESCRIPTION_ALLERGY_RULE_IDS.has(base) ||
    /prescription_allergy|allergy_medication_conflict/i.test(base)
  );
}

function isInteractionRule(ruleId: string): boolean {
  const base = normalizeRuleId(ruleId);
  return (
    INTERACTION_RULE_IDS.has(ruleId) ||
    INTERACTION_RULE_IDS.has(base) ||
    /beta-lactam|ace-inhibitor|interact/i.test(base)
  );
}

function isOrderSelectRule(ruleId: string): boolean {
  return (
    isDuplicateRule(ruleId) || isPrescriptionAllergyRule(ruleId) || isInteractionRule(ruleId)
  );
}

function mapSeverityToVariant(alert: ClinicalAlert): SilentSuggestionVariant {
  if (isDuplicateRule(alert.ruleId)) return 'suggestion';
  if (alert.severity === 'critical') return 'warning';
  if (isPrescriptionAllergyRule(alert.ruleId) || isInteractionRule(alert.ruleId)) {
    return 'warning';
  }
  return 'suggestion';
}

/** MF-CU-03 — CDS Hooks order-select: duplicidad, alergia e interacción al prescribir. */
export function mapClinicalAlertsToOrderSelectCards(
  alerts: readonly ClinicalAlert[],
): OrderSelectCdsCard[] {
  const seen = new Set<string>();

  return alerts
    .filter((alert) => isOrderSelectRule(alert.ruleId))
    .map((alert) => {
      const id = `order-select-${alert.ruleId}`;
      if (seen.has(id)) return null;
      seen.add(id);

      const card: OrderSelectCdsCard = {
        id,
        variant: mapSeverityToVariant(alert),
        label: alert.message,
        hook: 'order-select',
        ruleId: alert.ruleId,
        source: alert.source,
      };
      if (alert.detail.trim()) card.detail = alert.detail;
      return card;
    })
    .filter((card): card is OrderSelectCdsCard => card !== null);
}
