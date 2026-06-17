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
  ['closure ff-01-03', 'reports/archive/2026-06/epis2-mf-ff-01-03-ficha-first.md'],
  ['closure ff-06', 'reports/archive/2026-06/epis2-mf-ff-06-clinical-shell-forms.md'],
  ['closure ff-00', 'reports/archive/2026-06/epis2-mf-ff-00-canon-censo-first.md'],
  ['closure ff-04', 'reports/archive/2026-06/epis2-mf-ff-04-dashboard-secondary.md'],
  ['closure ff-05', 'reports/archive/2026-06/epis2-mf-ff-05-vision-agent.md'],
  ['closure ff-07', 'reports/archive/2026-06/epis2-mf-ff-07-probable-actions.md'],
  ['closure ff-08', 'reports/archive/2026-06/epis2-mf-ff-08-live-templates.md'],
  ['closure ff-09', 'reports/archive/2026-06/epis2-mf-ff-09-evolution-layout.md'],
  ['closure ff-10', 'reports/archive/2026-06/epis2-mf-ff-10-prescription-a5.md'],
  ['closure ff-11', 'reports/archive/2026-06/epis2-mf-ff-11-ai-client.md'],
  ['closure ff-12', 'reports/archive/2026-06/epis2-mf-ff-12-web-ai-boundary.md'],
  ['closure ff-13', 'reports/archive/2026-06/epis2-mf-ff-13-ai-assist.md'],
  ['closure ff-14', 'reports/archive/2026-06/epis2-mf-ff-14-medrepo-loader.md'],
  ['closure prog ficha-first', 'reports/archive/2026-06/epis2-prog-ficha-first-close-2026.md'],
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
const ff07 = ledger.phases?.find((p) => p.id === 'MF-FF-07');
if (!ff07 || ff07.state !== 'DONE') {
  errors.push('ficha-first-ledger: MF-FF-07 debe estar DONE');
}
for (const id of [
  'MF-FF-08',
  'MF-FF-09',
  'MF-FF-10',
  'MF-FF-11',
  'MF-FF-12',
  'MF-FF-13',
  'MF-FF-14',
  'MF-FF-15',
]) {
  const phase = ledger.phases?.find((p) => p.id === id);
  if (!phase || phase.state !== 'DONE') {
    errors.push(`ficha-first-ledger: ${id} debe estar DONE`);
  }
}
const wave3 = ledger.waves?.find((w) => w.id === 'wave-3');
if (!wave3 || wave3.state !== 'DONE') {
  errors.push('ficha-first-ledger: wave-3 debe estar DONE');
}
const wave4 = ledger.waves?.find((w) => w.id === 'wave-4');
if (!wave4 || wave4.state !== 'DONE') {
  errors.push('ficha-first-ledger: wave-4 debe estar DONE');
}
const wave5 = ledger.waves?.find((w) => w.id === 'wave-5');
if (!wave5 || wave5.state !== 'DONE') {
  errors.push('ficha-first-ledger: wave-5 debe estar DONE');
}

const medrepoLoader = join(root, 'apps/api/src/ai/medrepoKnowledgePack.ts');
if (!existsSync(medrepoLoader)) {
  errors.push('Falta medrepoKnowledgePack.ts (MF-FF-14)');
}
const pkgScripts = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).scripts ?? {};
const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
const catalogGates = catalog.gates ?? {};
const uiAlias = catalogGates['quality:ui'];
const aiAlias = catalogGates['quality:ai'];
if (pkgScripts['quality:ui'] || pkgScripts['quality:ai']) {
  errors.push(
    'package.json root no debe definir quality:ui/quality:ai (usar catalog-full.json, MF-FF-15)',
  );
}
if (!uiAlias?.command?.includes('quality:ui-simplify-gate')) {
  errors.push('catalog-full.json debe definir quality:ui → quality:ui-simplify-gate (MF-FF-15)');
}
const aiCmd = aiAlias?.command ?? '';
if (
  !aiCmd.includes('quality:sh-03-degrade-gate') ||
  !aiCmd.includes('quality:ai-client-gate') ||
  !aiCmd.includes('quality:web-ai-boundary-gate')
) {
  errors.push(
    'catalog-full.json debe definir quality:ai con sh-03, ai-client y web-ai-boundary (MF-FF-15)',
  );
}

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!formPage.includes('buildLiveTemplatePrefill')) {
  errors.push('GeneratedClinicalFormPage debe cablear live templates (MF-FF-08)');
}
if (!formPage.includes('epis2-cica-evolution-form')) {
  errors.push('GeneratedClinicalFormPage debe usar shell CICA evolución (CICA-L-04 / MF-FF-09)');
}
if (!existsSync(join(root, 'apps/web/src/pages/prescriptionTripleViewNav.ts'))) {
  errors.push('Falta prescriptionTripleViewNav.ts (MF-FF-10)');
}
if (!existsSync(join(root, 'packages/ai-client/package.json'))) {
  errors.push('Falta packages/ai-client (MF-FF-11)');
}
const webPkg = JSON.parse(readFileSync(join(root, 'apps/web/package.json'), 'utf8'));
if (webPkg.dependencies?.['@epis2/local-ai']) {
  errors.push('apps/web no debe depender de @epis2/local-ai (MF-FF-12)');
}

const workspacePage = readFileSync(
  join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'),
  'utf8',
);
if (!workspacePage.includes('getProbablePatientActionChips')) {
  errors.push('PatientWorkspacePage debe cablear acciones probables (MF-FF-07)');
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
if (!router.includes('getParentRoute: () => clinicalLayoutRoute')) {
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

console.log('ficha-first-gate OK — MF-FF-00…15 · wave-1…5 · PROG-FICHA-FIRST cerrado');
