#!/usr/bin/env node
/**
 * MF-178 — verificación automatizada alineada a normas M3 documentadas.
 * Canon visual manual: docs/quality/M3_VISUAL_SIGNOFF_STEPS.md
 */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function run(label, cmd, args) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.error(`verify-m3-signoff FAILED en: ${label}`);
    process.exit(result.status ?? 1);
  }
}

run('theme:validate (THEME-05/06/07)', 'npm', ['run', 'tool:script', '--', 'theme:validate']);
run('gates M3 tokens + journey + offline', 'npx', [
  'vitest',
  'run',
  'tests/golden-clinical-journey-theme.spec.ts',
  'packages/epis2-ui/src/theme/create-epis2-theme.dark.test.ts',
  'packages/epis2-ui/src/theme/create-epis2-theme.contrast.test.ts',
  'packages/epis2-ui/src/theme/clinical-roles.contrast.test.ts',
  'packages/epis2-ui/src/theme/components.motion.test.ts',
  'packages/epis2-ui/src/theme/generated/theme-generated.test.ts',
  'apps/web/src/components/OfflineStatusBanner.test.tsx',
  'packages/epis2-ui/src/widgets/Epis2WidgetSurface.test.tsx',
]);
console.log('\nverify-m3-signoff OK — gates M3 automatizados verdes');
console.log('Recorrido visual humano: docs/quality/M3_VISUAL_SIGNOFF_STEPS.md (V1–V6)');
