import { parseJsonFromOllamaText } from '../ollama/json-from-response.mjs';
import { parseDevSessionPlan, parseDevLowRiskWritePlan } from './schemas.mjs';

/** @param {string} text */
export function parseDevSessionPlanFromOllamaText(text) {
  const extracted = parseJsonFromOllamaText(text);
  if (!extracted.ok) return { ok: false, error: extracted.reason };
  return parseDevSessionPlan(extracted.value);
}

/** @param {string} text */
export function parseDevLowRiskWritePlanFromOllamaText(text) {
  const extracted = parseJsonFromOllamaText(text);
  if (!extracted.ok) return { ok: false, error: extracted.reason };
  return parseDevLowRiskWritePlan(extracted.value);
}
