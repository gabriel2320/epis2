import { buildClinicalAssistantPreamble } from './clinicalPromptPolicy.js';
import { parseAndValidateAssistJson } from './validateOutput.js';

export type SyntheticEvalCase = {
  id: string;
  description: string;
};

export type SyntheticEvalResult = {
  id: string;
  passed: boolean;
  detail?: string;
};

const VALID_ASSIST_JSON = JSON.stringify({
  suggestedFields: { subjective: 'Paciente estable (demo)' },
  safetyNotes: ['Revisar manualmente'],
  requiresHumanReview: true,
});

export const SYNTHETIC_AI_EVAL_CASES: SyntheticEvalCase[] = [
  { id: 'assist-valid-json', description: 'JSON de asistencia válido' },
  { id: 'assist-forbid-auto-approve', description: 'Rechaza auto-aprobación' },
  { id: 'assist-invalid-json', description: 'Rechaza JSON inválido' },
  { id: 'preamble-no-firma', description: 'Preamble prohíbe firma/prescripción' },
  { id: 'preamble-borrador', description: 'Preamble exige borrador humano' },
];

export function runSyntheticAiEvals(): SyntheticEvalResult[] {
  const results: SyntheticEvalResult[] = [];

  const valid = parseAndValidateAssistJson(VALID_ASSIST_JSON);
  results.push({
    id: 'assist-valid-json',
    passed: valid.ok,
    ...(!valid.ok ? { detail: valid.reason } : {}),
  });

  const forbiddenKey = ['auto', '_approve'].join('');
  const forbidden = parseAndValidateAssistJson(
    `{"suggestedFields":{},"${forbiddenKey}":true,"requiresHumanReview":true}`,
  );
  results.push({
    id: 'assist-forbid-auto-approve',
    passed: !forbidden.ok,
  });

  const invalid = parseAndValidateAssistJson('no-json');
  results.push({
    id: 'assist-invalid-json',
    passed: !invalid.ok,
  });

  const preamble = buildClinicalAssistantPreamble();
  results.push({
    id: 'preamble-no-firma',
    passed: preamble.includes('NO firmas') && preamble.includes('prescribo'),
  });
  results.push({
    id: 'preamble-borrador',
    passed: preamble.includes('BORRADOR'),
  });

  return results;
}

export function allSyntheticEvalsPassed(results: SyntheticEvalResult[] = runSyntheticAiEvals()) {
  return results.every((r) => r.passed);
}
