import { walkSourceFiles } from './lib/scan-sources.mjs';

const CANONICAL_PREFIX = 'packages/clinical-forms/';
const FORBIDDEN_NAMES = ['formRegistry.ts', 'clinicalFormRegistry.ts', 'blueprintRegistry.ts'];

export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles()) {
    for (const name of FORBIDDEN_NAMES) {
      if (rel.endsWith(name) && !rel.startsWith(CANONICAL_PREFIX)) {
        details.push(`${rel} → segundo Clinical Form Registry prohibido`);
      }
    }
    if (
      /FormRegistryV2|secondFormRegistry|createFormRegistry\(/i.test(content) &&
      !rel.startsWith(CANONICAL_PREFIX)
    ) {
      details.push(`${rel} → posible segundo Form Registry`);
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Un solo Clinical Form Registry (packages/clinical-forms)'
        : 'Se detectó duplicación de Form Registry',
    details,
  };
}
