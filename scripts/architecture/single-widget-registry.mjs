import { walkSourceFiles } from './lib/scan-sources.mjs';

const CANONICAL_PREFIX = 'packages/epis2-widgets/';
const FORBIDDEN_DUPLICATE_NAMES = [
  'widgetRegistry.ts',
  'WidgetRegistry.ts',
  'clinicalWidgetRegistry.ts',
];

export async function validate() {
  const details = [];
  const registryFiles = [];

  for await (const { rel, content } of walkSourceFiles()) {
    for (const name of FORBIDDEN_DUPLICATE_NAMES) {
      if (rel.endsWith(name) && !rel.startsWith(CANONICAL_PREFIX)) {
        details.push(`${rel} → segundo widget registry prohibido (canónico: ${CANONICAL_PREFIX})`);
      }
    }
    if (rel.includes('epis2-widgets') && rel.endsWith('widget-registry.ts') && !rel.includes('.test.')) {
      registryFiles.push(rel);
    }
    if (/WidgetRegistryV2|secondWidgetRegistry|createWidgetRegistry\(/i.test(content) && !rel.startsWith(CANONICAL_PREFIX)) {
      details.push(`${rel} → indica un segundo Widget Registry`);
    }
  }

  const canonical = registryFiles.filter((r) => r.startsWith(CANONICAL_PREFIX));
  if (canonical.length === 0) {
    details.push('Falta registry canónico en packages/epis2-widgets');
  }
  if (canonical.length > 1) {
    details.push(`Múltiples widget-registry.ts en epis2-widgets: ${canonical.join(', ')}`);
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Un solo Widget Registry (packages/epis2-widgets)'
        : 'Se detectó duplicación de Widget Registry',
    details,
  };
}
