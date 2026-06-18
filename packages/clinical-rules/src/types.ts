export type ClinicalRuleSeverity = 'info' | 'warning' | 'critical' | 'blocking';

export type MedicationDraftLine = {
  name?: string;
  dose?: string;
  route?: string;
  frequency?: string;
};

export type CriticalLabLine = {
  id: string;
  value: number;
  acknowledged?: boolean;
};

export type ClinicalRuleContext = {
  draftType?: string;
  blueprintId?: string;
  patient?: {
    allergies?: readonly string[];
    criticalLabs?: readonly CriticalLabLine[];
  };
  form?: Record<string, unknown>;
  medications?: readonly MedicationDraftLine[];
};

export type ClinicalRuleDefinition = {
  id: string;
  name: string;
  appliesTo: readonly string[];
  severity: ClinicalRuleSeverity;
  message: string;
  evaluate: (ctx: ClinicalRuleContext) => boolean;
};

export type ClinicalRuleHit = {
  ruleId: string;
  name: string;
  severity: ClinicalRuleSeverity;
  message: string;
};

export type ClinicalRulesEvaluation = {
  hits: readonly ClinicalRuleHit[];
  blocking: boolean;
  hasCritical: boolean;
};
