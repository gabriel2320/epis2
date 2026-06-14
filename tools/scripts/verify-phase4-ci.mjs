#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE Fase 4 — documenta cierre y verifica gates post-prune compatibles con CI.
 *   npm run tool:consolidate:verify-phase4
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const ciGates = [
  'quality:case-intel-closure-gate',
  'quality:openapi-gate',
  'quality:pm01',
  'quality:layers-integration-gate',
  'quality:ci-parity',
  'quality:golden-journey',
  'quality:dual-chart-gate',
];

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
for (const gate of ciGates) {
  if (!catalog.gates?.[gate]) errors.push(`catalog-full sin ${gate}`);
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (!pkg.scripts?.['build:packages']?.includes('@epis2/ai-client')) {
  errors.push('build:packages debe incluir @epis2/ai-client antes de local-ai');
}

for (const script of ['db:migrate', 'test:e2e', 'test:e2e:dual-chart']) {
  if (!pkg.scripts?.[script]?.includes('@epis2/')) {
    errors.push(`root ${script} debe ser shim a workspace`);
  }
}

const dry = spawnSync('node', ['tools/gates/run-gate.mjs', '--dry-run', 'required'], {
  cwd: root,
  encoding: 'utf8',
});
if (dry.status !== 0) errors.push('quality:required dry-run falló');

if (errors.length) {
  console.error('phase4-verify FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('phase4-verify OK — CI gates en catálogo, shims workspace, required dry-run');
