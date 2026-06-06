#!/usr/bin/env node
/** MF-OLA3-003 — Banner alertas ficha (IDC 22). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/ClinicalAlertsPanel.tsx',
  'apps/web/src/pages/PatientWorkspacePage.test.tsx',
  'e2e/ola3-ficha-journey.spec.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
if (!e2e.includes('epis2-clinical-alerts')) {
  errors.push('e2e ola3 sin banner alertas ficha');
}

if (errors.length) {
  console.error('ola3-alerts-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-alerts-gate OK');
