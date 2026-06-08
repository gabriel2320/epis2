#!/usr/bin/env node
/** MF-FORM-SCREEN-TREE — árbol formulario→pantalla alineado con canon y router. */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const treeModule = join(root, 'packages/clinical-forms/src/formScreenTree.ts');
const treeDoc = join(root, 'docs/product/EPIS2_FORM_SCREEN_TREE.md');
const router = join(root, 'apps/web/src/routes/router.tsx');
const formPage = join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx');
const breakpoints = join(root, 'packages/epis2-ui/src/theme/breakpoints.ts');

for (const file of [treeModule, treeDoc, router, formPage, breakpoints]) {
  if (!existsSync(file)) errors.push(`Falta ${file.replace(root + '/', '')}`);
}

const treeSrc = readFileSync(treeModule, 'utf8');
if (!treeSrc.includes('EPIS2_FORM_SCREEN_TREE')) {
  errors.push('formScreenTree.ts sin EPIS2_FORM_SCREEN_TREE');
}
if (!treeSrc.includes('assertFormScreenTreeInvariants')) {
  errors.push('formScreenTree.ts sin assertFormScreenTreeInvariants');
}

const routerSrc = readFileSync(router, 'utf8');
const blueprintDir = join(root, 'packages/clinical-forms/src/blueprints');
const routePaths = new Set();
for (const file of readdirSync(blueprintDir)) {
  if (!file.endsWith('.ts')) continue;
  const src = readFileSync(join(blueprintDir, file), 'utf8');
  const match = src.match(/routePath:\s*'(\/espacio\/[^']+)'/);
  if (match) routePaths.add(match[1]);
}
for (const route of routePaths) {
  if (!routerSrc.includes(`path: '${route}'`) && !routerSrc.includes(`path: "${route}"`)) {
    errors.push(`router.tsx sin ruta ${route}`);
  }
}

const pageSrc = readFileSync(formPage, 'utf8');
if (!pageSrc.includes('epis2ClinicalFormContentMaxWidthSx')) {
  errors.push('GeneratedClinicalFormPage sin token responsive de encuadre');
}
if (pageSrc.includes('maxWidth: contextOpen ? \'100%\' : 640')) {
  errors.push('GeneratedClinicalFormPage aún usa maxWidth 640px fijo');
}

const bpSrc = readFileSync(breakpoints, 'utf8');
if (!bpSrc.includes("clinicalFormMaxWidth: { xs: '100%'")) {
  errors.push('breakpoints.ts sin clinicalFormMaxWidth responsive');
}

const docSrc = readFileSync(treeDoc, 'utf8');
if (!docSrc.includes('docs/PRODUCT_CANON.md')) {
  errors.push('EPIS2_FORM_SCREEN_TREE.md sin vínculo al canon');
}
if (!docSrc.includes('command-first')) {
  errors.push('EPIS2_FORM_SCREEN_TREE.md sin principio command-first');
}

const testRun = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/clinical-forms/src/formScreenTree.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (testRun.status !== 0) {
  errors.push(`formScreenTree.test.ts falló:\n${testRun.stdout ?? ''}${testRun.stderr ?? ''}`);
}

if (errors.length) {
  console.error('form-screen-tree-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('form-screen-tree-gate OK — árbol formulario/pantalla canónico y responsive');
