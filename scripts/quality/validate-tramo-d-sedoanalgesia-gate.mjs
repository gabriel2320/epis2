#!/usr/bin/env node
/** MF-TRAMO-D-012 — Sedoanalgesia demo (IDC 49). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-sedoanalgesia',
  'epis2-icu-sedoanalgesia-rows',
  'copy.icu.sedoanalgesiaTitle',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('sedoanalgesia') || !api.includes('idc: 49')) {
  errors.push('icu.ts sin sedoanalgesia o IDC 49 active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-sedoanalgesia')) errors.push('e2e tramo-d sin journey sedoanalgesia');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-012')) errors.push('IDC 49 sin nota MF-TRAMO-D-012');

if (errors.length) {
  console.error('tramo-d-sedoanalgesia-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-sedoanalgesia-gate OK — sedoanalgesia demo (IDC 49)');
