import { walkSourceFiles } from './lib/scan-sources.mjs';

/** FHIR es frontera de API — no modelo de UI ni import v1. */
export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles()) {
    if (!rel.startsWith('apps/web/')) continue;
    if (content.includes('@epis2/fhir-export')) {
      details.push(`${rel} → la UI no debe importar @epis2/fhir-export`);
    }
  }

  for await (const { rel, content } of walkSourceFiles()) {
    if (!rel.startsWith('packages/fhir-export/')) continue;
    if (content.includes('@epis2/clinical-forms')) {
      details.push(`${rel} → fhir-export no debe depender de formularios UI`);
    }
    if (/\bfhir\.import\b|importFhir|POST\s+.*\/api\/fhir/.test(content)) {
      details.push(`${rel} → importación FHIR no permitida en v1`);
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'FHIR solo en frontera API (sin UI ni forms)'
        : 'Violación frontera FHIR',
    details,
  };
}
