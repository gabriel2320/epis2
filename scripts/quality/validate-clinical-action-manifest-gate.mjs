#!/usr/bin/env node
/** MF-LX-01 — manifest clínico derivado sin drift registry/CICA/forms. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const manifestPath = join(root, 'packages/command-registry/src/clinical-action-manifest.ts');
const registryPath = join(root, 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts');
const forbiddenSecondRegistry = join(root, 'clinicalActions.manifest.ts');

if (!existsSync(manifestPath)) {
  errors.push('Falta packages/command-registry/src/clinical-action-manifest.ts');
}
if (existsSync(forbiddenSecondRegistry)) {
  errors.push('Prohibido clinicalActions.manifest.ts en raíz — usar command-registry');
}

const manifestSrc = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : '';
const registrySrc = existsSync(registryPath) ? readFileSync(registryPath, 'utf8') : '';

for (const token of [
  'CLINICAL_ACTION_MANIFEST',
  'INTENT_CICA_SCREEN_IDS',
  'assertClinicalActionManifestInvariants',
  'GOLDEN_CICA_INTENTS',
  'aiRequired: false',
]) {
  if (!manifestSrc.includes(token)) {
    errors.push(`clinical-action-manifest.ts falta ${token}`);
  }
}

const screenIds = [...registrySrc.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
const mapBlock = manifestSrc.match(
  /export const INTENT_CICA_SCREEN_IDS[^=]*=\s*\{([\s\S]*?)\};/,
)?.[1];
const mappedScreenIds = mapBlock
  ? [...mapBlock.matchAll(/:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])
  : [];

for (const screenId of mappedScreenIds) {
  if (!screenIds.includes(screenId)) {
    errors.push(
      `INTENT_CICA_SCREEN_IDS referencia ${screenId} ausente en EPIS_CICA_SCREEN_REGISTRY`,
    );
  }
}

const indexSrc = readFileSync(join(root, 'packages/command-registry/src/index.ts'), 'utf8');
for (const exportName of [
  'CLINICAL_ACTION_MANIFEST',
  'INTENT_CICA_SCREEN_IDS',
  'GOLDEN_CICA_INTENTS',
  'assertClinicalActionManifestInvariants',
  'getClinicalActionByIntent',
  'buildClinicalActionContract',
]) {
  if (!indexSrc.includes(exportName)) {
    errors.push(`command-registry/index.ts no exporta ${exportName}`);
  }
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/command-registry/src/clinical-action-manifest.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (vitest.status !== 0) {
  errors.push('clinical-action-manifest tests fallaron');
  if (vitest.stdout) process.stdout.write(vitest.stdout);
  if (vitest.stderr) process.stderr.write(vitest.stderr);
}

if (errors.length) {
  console.error(
    'clinical-action-manifest-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('clinical-action-manifest-gate OK — manifest derivado MF-LX-01');
