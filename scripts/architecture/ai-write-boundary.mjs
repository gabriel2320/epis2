import { walkSourceFiles } from './lib/scan-sources.mjs';

const AI_ROOT = 'services/local-ai/';

const FORBIDDEN_IN_AI = [
  /from\s+['"].*apps\/api/i,
  /drizzle-orm/i,
  /clinical_notes/i,
  /\.insert\s*\(/i,
  /\.update\s*\([^)]*clinical/i,
  /approveDraft/i,
  /autoApprove/i,
  /writeClinicalRecord/i,
];

export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles()) {
    if (!rel.startsWith(AI_ROOT)) continue;
    for (const pattern of FORBIDDEN_IN_AI) {
      if (pattern.test(content)) {
        details.push(`${rel} → IA no puede escribir datos clínicos finales ni usar ORM clínico`);
        break;
      }
    }
  }

  for await (const { rel, content } of walkSourceFiles()) {
    if (!rel.startsWith('apps/api')) continue;
    if (/from\s+['"].*local-ai.*['"].*approve|ollama.*\.insert/i.test(content)) {
      details.push(`${rel} → API no debe delegar escritura clínica final a IA`);
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'IA separada de escrituras clínicas finales'
        : 'Violación de frontera IA ↔ datos clínicos',
    details,
  };
}
