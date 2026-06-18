import { CLINICAL_RULES_DEMO } from './rulesDemo.js';
import type {
  ClinicalRuleContext,
  ClinicalRuleDefinition,
  ClinicalRuleHit,
  ClinicalRulesEvaluation,
} from './types.js';

export function listClinicalRules(): readonly ClinicalRuleDefinition[] {
  return CLINICAL_RULES_DEMO;
}

export function getClinicalRuleById(id: string): ClinicalRuleDefinition | undefined {
  return CLINICAL_RULES_DEMO.find((rule) => rule.id === id);
}

function applies(rule: ClinicalRuleDefinition, ctx: ClinicalRuleContext): boolean {
  const keys = [ctx.draftType, ctx.blueprintId].filter(Boolean) as string[];
  if (keys.length === 0) return true;
  return keys.some((key) => rule.appliesTo.includes(key));
}

export function evaluateClinicalRules(ctx: ClinicalRuleContext): ClinicalRulesEvaluation {
  const hits: ClinicalRuleHit[] = [];

  for (const rule of CLINICAL_RULES_DEMO) {
    if (!applies(rule, ctx)) continue;
    if (!rule.evaluate(ctx)) continue;
    hits.push({
      ruleId: rule.id,
      name: rule.name,
      severity: rule.severity,
      message: rule.message,
    });
  }

  return {
    hits,
    blocking: hits.some((h) => h.severity === 'blocking'),
    hasCritical: hits.some((h) => h.severity === 'critical' || h.severity === 'blocking'),
  };
}

export function assertClinicalRulesInvariants(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  let blockingCount = 0;

  for (const rule of CLINICAL_RULES_DEMO) {
    if (ids.has(rule.id)) errors.push(`regla duplicada: ${rule.id}`);
    ids.add(rule.id);
    if (rule.severity === 'blocking') blockingCount += 1;
    if (!rule.message.trim()) errors.push(`${rule.id}: message vacio`);
    if (rule.appliesTo.length === 0) errors.push(`${rule.id}: appliesTo vacio`);
  }

  if (blockingCount < 2) {
    errors.push(`solo ${blockingCount} reglas blocking (min 2 demo)`);
  }

  return errors;
}
