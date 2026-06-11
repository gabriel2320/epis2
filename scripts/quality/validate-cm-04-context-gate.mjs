#!/usr/bin/env node
/** MF-CM-04 — contexto resolve: sección + chartMode + blueprint. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const sectionRank = join(root, 'packages/command-registry/src/context-section-rank.ts');
const contextRank = join(root, 'packages/command-registry/src/context-rank.ts');
const contracts = join(root, 'packages/contracts/src/commands.ts');
const hook = join(root, 'apps/web/src/clinical/useCommandResolveContext.ts');
const apiRoutes = join(root, 'apps/api/src/commands/routes.ts');

for (const [label, path] of [
  ['context-section-rank', sectionRank],
  ['context-rank', contextRank],
  ['commands contract', contracts],
  ['useCommandResolveContext', hook],
  ['API commands routes', apiRoutes],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const contractsSrc = readFileSync(contracts, 'utf8');
for (const needle of ['traditionalSection', 'chartMode', 'assistBlueprintId', 'plannerView']) {
  if (!contractsSrc.includes(needle)) errors.push(`commandActiveContextSchema falta ${needle}`);
}

const hookSrc = readFileSync(hook, 'utf8');
for (const needle of ['parseEhrSectionSearch', 'EHR_SECTION_SEARCH_KEY', 'traditionalSection']) {
  if (!hookSrc.includes(needle)) errors.push(`useCommandResolveContext falta ${needle}`);
}

const apiSrc = readFileSync(apiRoutes, 'utf8');
if (apiSrc.includes('ctx.workspace !== undefined')) {
  errors.push('API routes debe pasar contexto completo (no filtrar chartMode/sección)');
}
if (!apiSrc.includes('resolveInput.context = parsed.data.context')) {
  errors.push('API routes debe asignar parsed.data.context íntegro');
}

const rankSrc = readFileSync(contextRank, 'utf8');
if (!rankSrc.includes('traditionalSectionIntentBoost')) {
  errors.push('context-rank debe aplicar traditionalSectionIntentBoost');
}

if (!existsSync(join(root, 'reports/epis2-mf-cm-04-context.md'))) {
  errors.push('falta reports/epis2-mf-cm-04-context.md');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/command-registry/src/context-section-rank.test.ts',
    'packages/command-registry/src/context-rank.test.ts',
    'apps/web/src/clinical/useCommandResolveContext.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests context CM-04 fallaron');

if (errors.length) {
  console.error('cm-04-context-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-04-context-gate OK — MF-CM-04');
