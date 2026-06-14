#!/usr/bin/env node
/** MF-FF-01…06 — censo-first, dual chart default, /comando compat, ClinicalShell formularios. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate as validateCommandCenterHome } from '../architecture/command-center-home.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['home.ts', 'apps/web/src/routes/home.ts'],
  ['router', 'apps/web/src/routes/router.tsx'],
  ['dual env', 'apps/web/src/dev/dualChartModesEnv.ts'],
  ['clinical shell layout', 'apps/web/src/layouts/ClinicalShellLayout.tsx'],
  ['command dock', 'apps/web/src/components/chart/ChartEspacioCommandDock.tsx'],
  ['closure ff-01-03', 'reports/epis2-mf-ff-01-03-ficha-first.md'],
  ['closure ff-06', 'reports/epis2-mf-ff-06-clinical-shell-forms.md'],
  ['closure ff-00', 'reports/epis2-mf-ff-00-canon-censo-first.md'],
  ['closure ff-04', 'reports/epis2-mf-ff-04-dashboard-secondary.md'],
  ['closure ff-05', 'reports/epis2-mf-ff-05-vision-agent.md'],
  ['vision', 'docs/product/VISION_EPIS2.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

const invariants = readFileSync(join(root, 'docs/product/PRODUCT_INVARIANTS.md'), 'utf8');
if (!invariants.includes('/espacio/buscar-paciente')) {
  errors.push('PRODUCT_INVARIANTS #6 debe referenciar censo /espacio/buscar-paciente');
}

const golden = readFileSync(join(root, 'docs/quality/GOLDEN_CLINICAL_JOURNEY.md'), 'utf8');
if (!/paso 2|^\| 2 \|/m.test(golden) || !golden.includes('barra')) {
  errors.push('GOLDEN_CLINICAL_JOURNEY paso 2 debe describir censo + barra transversal');
}

const adr002 = readFileSync(join(root, 'docs/adr/ADR-002-dual-chart-modes.md'), 'utf8');
if (!adr002.includes('[x] Enmienda invariante #6')) {
  errors.push('ADR-002 debe marcar enmienda invariante #6 aprobada (MF-FF-00)');
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/ficha-first-ledger.json'), 'utf8'));
const ff00 = ledger.phases?.find((p) => p.id === 'MF-FF-00');
if (!ff00 || ff00.state !== 'DONE') {
  errors.push('ficha-first-ledger: MF-FF-00 debe estar DONE');
}
const ff04 = ledger.phases?.find((p) => p.id === 'MF-FF-04');
if (!ff04 || ff04.state !== 'DONE') {
  errors.push('ficha-first-ledger: MF-FF-04 debe estar DONE');
}
const ff05 = ledger.phases?.find((p) => p.id === 'MF-FF-05');
if (!ff05 || ff05.state !== 'DONE') {
  errors.push('ficha-first-ledger: MF-FF-05 debe estar DONE');
}
const wave2 = ledger.waves?.find((w) => w.id === 'wave-2');
if (!wave2 || wave2.state !== 'DONE') {
  errors.push('ficha-first-ledger: wave-2 debe estar DONE');
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (router.includes('CommandCenterPage')) {
  errors.push('router.tsx aún importa CommandCenterPage (debe ser redirect only)');
}
if (!router.includes("path: '/comando'")) {
  errors.push('router.tsx sin ruta /comando compat');
}
if (!router.includes('clinicalLayoutRoute')) {
  errors.push('router.tsx sin clinicalLayoutRoute (ClinicalShell)');
}
if (!router.includes("getParentRoute: () => clinicalLayoutRoute")) {
  errors.push('formularios /espacio/* deben colgar de clinicalLayoutRoute');
}

const layout = readFileSync(join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx'), 'utf8');
if (!layout.includes('ChartEspacioCommandDock')) {
  errors.push('ClinicalShellLayout debe montar ChartEspacioCommandDock');
}

const modes = readFileSync(join(root, 'apps/web/src/modes/episModes.ts'), 'utf8');
if (!modes.includes('EPIS2_CLINICAL_HOME')) {
  errors.push('episModes debe usar EPIS2_CLINICAL_HOME como ruta comando');
}

const homeGate = await validateCommandCenterHome();
if (!homeGate.ok) {
  errors.push(`command-center-home: ${homeGate.details?.join('; ') ?? homeGate.message}`);
}

function runVitest(label, paths) {
  const result = spawnSync('npx', ['vitest', 'run', ...paths], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) errors.push(`${label} falló`);
}

runVitest('MF-FF router/dual/modes', [
  'apps/web/src/routes/router.test.ts',
  'apps/web/src/dev/dualChartModesEnv.test.ts',
  'apps/web/src/modes/episModes.test.ts',
]);

if (errors.length) {
  console.error('ficha-first-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ficha-first-gate OK — MF-FF-00…06 · wave-2 (MF-FF-04/05)');
