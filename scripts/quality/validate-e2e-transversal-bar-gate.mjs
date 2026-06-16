#!/usr/bin/env node
/** PROG-E2E-HYGIENE — E2E usa barra transversal censo-first; sin epis2-power-bar legacy. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const e2eDir = join(root, 'e2e');
const errors = [];

const FORBIDDEN = ['epis2-power-bar', 'epis2-floating-command-dock'];

function walkTsFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      out.push(...walkTsFiles(path));
      continue;
    }
    if (name.endsWith('.ts')) out.push(path);
  }
  return out;
}

const helper = readFileSync(join(e2eDir, 'helpers/demoPatient.ts'), 'utf8');
if (!helper.includes('getTransversalCommandBar')) {
  errors.push('e2e/helpers/demoPatient.ts debe exportar getTransversalCommandBar');
}
for (const token of FORBIDDEN) {
  if (helper.includes(token)) {
    errors.push(`demoPatient.ts no debe referenciar ${token}`);
  }
}
if (!helper.includes('epis2-census-command-bar') || !helper.includes('epis2-chart-command-bar')) {
  errors.push('getTransversalCommandBar debe incluir censo y ficha dual');
}

for (const file of walkTsFiles(e2eDir)) {
  const rel = file.slice(root.length + 1).replace(/\\/g, '/');
  const src = readFileSync(file, 'utf8');
  for (const token of FORBIDDEN) {
    if (src.includes(token)) {
      errors.push(`${rel} referencia legacy ${token}`);
    }
  }
}

if (errors.length) {
  console.error(
    'e2e-transversal-bar-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('e2e-transversal-bar-gate OK — PROG-E2E-HYGIENE sin dock/power-bar legacy');
