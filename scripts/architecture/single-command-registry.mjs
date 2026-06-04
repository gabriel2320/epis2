import { walkSourceFiles } from './lib/scan-sources.mjs';

const CANONICAL_PREFIX = 'packages/command-registry/';
const FORBIDDEN_DUPLICATE_NAMES = [
  'commandRegistry.ts',
  'intentRouter.ts',
  'clinicalIntentResolver.ts',
];

export async function validate() {
  const details = [];
  const registryFiles = [];

  for await (const { rel } of walkSourceFiles()) {
    for (const name of FORBIDDEN_DUPLICATE_NAMES) {
      if (rel.endsWith(name) && !rel.startsWith(CANONICAL_PREFIX)) {
        details.push(`${rel} → segundo registry/router prohibido (canónico: ${CANONICAL_PREFIX})`);
      }
    }
    if (rel.includes('command-registry') && rel.endsWith('.ts')) {
      registryFiles.push(rel);
    }
    if (/createCommandRegistry|secondRegistry|CommandRegistryV2/i.test(rel)) {
      details.push(`${rel} → indica un segundo Command Registry`);
    }
  }

  const hasCanonical = registryFiles.some((r) => r.startsWith(CANONICAL_PREFIX));
  if (!hasCanonical && registryFiles.length > 1) {
    details.push('Múltiples archivos command-registry sin paquete canónico');
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Un solo Command Registry (packages/command-registry)'
        : 'Se detectó duplicación de Command Registry',
    details,
  };
}
