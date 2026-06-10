#!/usr/bin/env node
/** MF-OLA3-005 — Timeline invocable desde ficha compacta (IDC 23). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/PatientRecentActivityBlock.tsx',
  'apps/web/src/components/PatientRecentActivityBlock.test.tsx',
  'e2e/ola3-ficha-journey.spec.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const activity = readFileSync(
  join(root, 'apps/web/src/components/PatientRecentActivityBlock.tsx'),
  'utf8',
);
for (const token of ['epis2-ficha-open-timeline', 'onViewFullTimeline']) {
  if (!activity.includes(token)) errors.push(`PatientRecentActivityBlock sin ${token}`);
}

const workspace = readFileSync(join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'), 'utf8');
for (const token of ['openHistory', 'focusSection', "openHistory('timeline')"]) {
  if (!workspace.includes(token)) errors.push(`PatientWorkspacePage sin ${token}`);
}

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
if (!panel.includes('focusSection')) {
  errors.push('PatientLongitudinalPanel sin focusSection');
}

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
if (!e2e.includes('epis2-ficha-open-timeline')) {
  errors.push('e2e ola3 sin epis2-ficha-open-timeline');
}

if (errors.length) {
  console.error('ola3-timeline-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-timeline-gate OK — IDC 23 timeline invocable UX-B.2');
