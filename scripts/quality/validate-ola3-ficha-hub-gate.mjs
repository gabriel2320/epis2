#!/usr/bin/env node
/** MF-OLA3-006 — Hub ficha paciente (IDC 21). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
for (const token of ['epis2-patient-workspace', 'epis2-longitudinal-panel', 'epis2-ficha-widget-panel']) {
  if (!e2e.includes(token)) errors.push(`e2e ola3 sin ${token}`);
}

const workspaceTest = readFileSync(
  join(root, 'apps/web/src/pages/PatientWorkspacePage.test.tsx'),
  'utf8',
);
if (!workspaceTest.includes('epis2-longitudinal-panel')) {
  errors.push('PatientWorkspacePage.test sin panel longitudinal');
}

if (errors.length) {
  console.error('ola3-ficha-hub-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-ficha-hub-gate OK — IDC 21 hub ficha');
