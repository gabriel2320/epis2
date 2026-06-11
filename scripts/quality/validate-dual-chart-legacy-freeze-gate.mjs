#!/usr/bin/env node
/** MF-DUAL-CHART-04 — Congelar legacy classic/dashboard. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const switcher = readFileSync(
  join(root, 'apps/web/src/components/modes/EpisModeSwitcher.tsx'),
  'utf8',
);
if (!switcher.includes('deprecated') && !switcher.includes('deprecat')) {
  errors.push('EpisModeSwitcher.tsx debe mostrar banner deprecación classic/dashboard');
}

const navigate = readFileSync(join(root, 'apps/web/src/routes/clinicalNavigate.ts'), 'utf8');
if (
  !navigate.includes('chartMode=traditional') &&
  !navigate.includes('chartMode:') &&
  !navigate.includes("chartMode: 'traditional'")
) {
  errors.push('clinicalNavigate.ts debe redirigir ?mode=classic → chartMode=traditional');
}

if (errors.length) {
  console.error('dual-chart-legacy-freeze-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const threeModes = spawnSync(
  process.execPath,
  [join(root, 'scripts/quality/validate-three-modes-gate.mjs')],
  { stdio: 'inherit' },
);
if (threeModes.status !== 0) process.exit(threeModes.status ?? 1);

console.log('dual-chart-legacy-freeze-gate OK — MF-DUAL-CHART-04 legacy congelado');
