#!/usr/bin/env node
/** CICA-SG — canon + proposeEpisScreen() + tests fijos. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const canon = join(root, 'docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md');
try {
  const doc = readFileSync(canon, 'utf8');
  for (const token of [
    'proposeEpisScreen',
    'calculateAdmissionScore',
    'Admission Score',
    'reject-duplicate',
    'dedicated-mode',
  ]) {
    if (!doc.includes(token)) {
      errors.push(`EPIS2_CICA_SCREEN_GOVERNOR.md sin: ${token}`);
    }
  }
  if (doc.includes('quality:cica-screen-governor-gate` | Pendiente')) {
    errors.push('Actualizar estado gate CICA-SG en canon (debe estar implementado)');
  }
} catch {
  errors.push('Falta docs/design/EPIS2_CICA_SCREEN_GOVERNOR.md');
}

const files = [
  'packages/epis2-ui/src/screen-governor/cicaScreenTypes.ts',
  'packages/epis2-ui/src/screen-governor/cicaScreenScoring.ts',
  'packages/epis2-ui/src/screen-governor/cicaScreenGovernor.ts',
  'packages/epis2-ui/src/screen-governor/cicaScreenGovernor.test.ts',
  'packages/epis2-ui/src/screen-governor/index.ts',
  'reports/cica-sg/_TEMPLATE.md',
];

for (const rel of files) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta ${rel}`);
  }
}

const governor = readFileSync(
  join(root, 'packages/epis2-ui/src/screen-governor/cicaScreenGovernor.ts'),
  'utf8',
);
for (const fn of ['proposeEpisScreen', 'inferLayoutProfile']) {
  if (!governor.includes(`function ${fn}`)) {
    errors.push(`cicaScreenGovernor.ts sin ${fn}()`);
  }
}

const scoring = readFileSync(
  join(root, 'packages/epis2-ui/src/screen-governor/cicaScreenScoring.ts'),
  'utf8',
);
if (!scoring.includes('calculateAdmissionScore')) {
  errors.push('cicaScreenScoring.ts sin calculateAdmissionScore()');
}

const layoutExport = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/index.ts'),
  'utf8',
);
if (!layoutExport.includes('screen-governor')) {
  errors.push('layout/clinical/index.ts debe re-exportar screen-governor');
}

const testRun = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/epis2-ui/src/screen-governor/cicaScreenGovernor.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (testRun.status !== 0) {
  errors.push(`cicaScreenGovernor.test.ts falló:\n${testRun.stdout ?? ''}${testRun.stderr ?? ''}`);
}

if (errors.length) {
  console.error('cica-screen-governor-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-screen-governor-gate OK — CICA-SG proposeEpisScreen + 10 casos');
