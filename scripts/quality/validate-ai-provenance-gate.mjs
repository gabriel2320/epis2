#!/usr/bin/env node
/** MF-IM-06/07 — Export FHIR Provenance + AIAST + model card estática. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['toFhirProvenance', 'packages/fhir-export/src/mappers.ts'],
  ['toFhirAiDevice', 'packages/fhir-export/src/mappers.ts'],
  ['buildAssistProvenanceExtras', 'packages/fhir-export/src/mappers.ts'],
  ['toFhirAiModelCardDocumentReference', 'packages/fhir-export/src/mappers.ts'],
  ['EPIS2_AIAST_SYSTEM', 'packages/fhir-export/src/constants.ts'],
  ['EPIS2_MODEL_CARD_SYSTEM', 'packages/fhir-export/src/constants.ts'],
  ['AiProvenanceRecord contract', 'packages/contracts/src/ai-provenance.ts'],
  ['model card canon', 'docs/product/EPIS2_AI_MODEL_CARD.md'],
  ['closure im-06', 'reports/epis2-mf-im-06-provenance-fhir.md'],
  ['closure im-07', 'reports/epis2-mf-im-07-model-card.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Falta ${label}: ${rel}`);
  }
}

const mappersSrc = readFileSync(join(root, 'packages/fhir-export/src/mappers.ts'), 'utf8');
for (const token of [
  'toFhirProvenance',
  'toFhirAiDevice',
  'toFhirAiModelCardDocumentReference',
  'buildAssistProvenanceExtras',
  'AIAST',
  'buildAiModelCardMarkdown',
]) {
  if (!mappersSrc.includes(token)) errors.push(`mappers.ts sin ${token}`);
}

function run(label, cmd, args, { inherit = false } = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    shell: true,
    stdio: inherit ? 'inherit' : 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    errors.push(`${label} falló`);
    if (!inherit && result.stderr) process.stderr.write(result.stderr);
  }
}

run('build contracts', 'npm', ['run', 'build', '-w', '@epis2/contracts']);
run('build fhir-export', 'npm', ['run', 'build', '-w', '@epis2/fhir-export']);

run(
  'MF-IM-06/07 fhir-export provenance + model card',
  'npx',
  ['vitest', 'run', 'packages/fhir-export/src/mappers.test.ts'],
  { inherit: true },
);

if (errors.length) {
  console.error('ai-provenance-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ai-provenance-gate OK — MF-IM-06 Provenance + AIAST + MF-IM-07 model card export');
