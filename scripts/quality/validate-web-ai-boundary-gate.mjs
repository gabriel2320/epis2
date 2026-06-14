#!/usr/bin/env node
/** MF-FF-12 — apps/web sin dependencia directa @epis2/local-ai. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const webPkg = JSON.parse(readFileSync(join(root, 'apps/web/package.json'), 'utf8'));
if (webPkg.dependencies?.['@epis2/local-ai']) {
  errors.push('apps/web no debe depender de @epis2/local-ai (usar @epis2/ai-client)');
}
if (!webPkg.dependencies?.['@epis2/ai-client']) {
  errors.push('apps/web debe depender de @epis2/ai-client');
}

function walkTs(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkTs(full, acc);
    else if (/\.tsx?$/.test(entry) && !entry.endsWith('.test.ts')) acc.push(full);
  }
  return acc;
}

for (const file of walkTs(join(root, 'apps/web/src'))) {
  if (readFileSync(file, 'utf8').includes('@epis2/local-ai')) {
    errors.push(`import local-ai prohibido: ${file.replace(root + '/', '')}`);
  }
}

if (errors.length) {
  console.error('web-ai-boundary-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('web-ai-boundary-gate OK — MF-FF-12');
