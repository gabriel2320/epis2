#!/usr/bin/env node
/** MF-PURGE-09 — shell clínico productivo sin imports design-agents. */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const labDir = join(root, 'apps/web/src/lab/design-agents');
const legacyDir = join(root, 'apps/web/src/design-agents');
const closeReport = join(root, 'reports/epis2-mf-purge-09-close.md');

const clinicalRoots = [
  'apps/web/src/pages',
  'apps/web/src/components',
  'apps/web/src/layouts',
  'apps/web/src/cica',
  'apps/web/src/clinical',
  'apps/web/src/routes',
  'apps/web/src/modes',
  'apps/web/src/navigation',
];

const allowlistRelPaths = new Set(['apps/web/src/design/EpisDesignModeProvider.tsx']);

const forbiddenTokens = [
  'design-agents/',
  'design-agents\\',
  '../design-agents',
  '../../design-agents',
];

function rel(p) {
  return relative(root, p).replace(/\\/g, '/');
}

function isTestFile(name) {
  return name.endsWith('.test.ts') || name.endsWith('.test.tsx');
}

function isAllowed(relPath) {
  if (allowlistRelPaths.has(relPath)) return true;
  if (isTestFile(relPath)) return true;
  if (relPath.includes('/pages/dev/')) return true;
  if (relPath.startsWith('apps/web/src/lab/')) return true;
  return false;
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'dev' && rel(p).endsWith('/pages/dev')) continue;
      walk(p);
      continue;
    }
    if (!p.endsWith('.ts') && !p.endsWith('.tsx')) continue;
    const relPath = rel(p);
    if (isAllowed(relPath)) continue;
    const src = readFileSync(p, 'utf8');
    for (const token of forbiddenTokens) {
      if (src.includes(token)) {
        errors.push(`${relPath} importa design-agents — prohibido en shell clínico`);
        break;
      }
    }
  }
}

if (!existsSync(labDir)) {
  errors.push('falta apps/web/src/lab/design-agents/');
}
if (existsSync(legacyDir)) {
  errors.push('apps/web/src/design-agents/ debe moverse a lab/design-agents/');
}
if (!existsSync(closeReport)) {
  errors.push('falta reports/epis2-mf-purge-09-close.md');
}

const envSrc = existsSync(join(labDir, 'designAgentsEnv.ts'))
  ? readFileSync(join(labDir, 'designAgentsEnv.ts'), 'utf8')
  : '';
if (!envSrc.includes('EPIS2_DESIGN_AGENTS_ENABLED')) {
  errors.push('designAgentsEnv debe gatear con EPIS2_DESIGN_AGENTS_ENABLED');
}

for (const clinicalRoot of clinicalRoots) {
  const abs = join(root, clinicalRoot);
  if (!existsSync(abs)) {
    errors.push(`falta ${clinicalRoot}`);
    continue;
  }
  walk(abs);
}

if (errors.length) {
  console.error(
    'web-no-design-agents-in-clinical-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('web-no-design-agents-in-clinical-gate OK — design-agents acotados a lab/');
