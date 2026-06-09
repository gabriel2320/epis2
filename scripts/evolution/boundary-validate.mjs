#!/usr/bin/env node
/**
 * Validador de frontera arquitectónica Evolab ↔ EPIS2.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const CLINICAL_APPS = ['apps/web', 'apps/api'];
const EVOLAB_APP = 'apps/evolution-lab';
const FORBIDDEN_EVOLAB_IMPORTS = ['apps/api/src', 'apps/web/src', '@epis2/api'];
const FORBIDDEN_CLINICAL_IMPORTS = ['@epis2/evolution-lab', 'evolution-lab', 'evolution-console'];

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkFiles(full, acc);
    } else if (/\.(ts|tsx|mjs|js)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

function scanImports(baseDir, forbidden) {
  const violations = [];
  const absBase = join(ROOT, baseDir);
  for (const file of walkFiles(absBase)) {
    const content = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file);
    for (const pattern of forbidden) {
      if (
        content.includes(`from '${pattern}`) ||
        content.includes(`from "${pattern}`) ||
        content.includes(`import('${pattern}`) ||
        content.includes(`import("${pattern}`)
      ) {
        violations.push(`${rel} → import prohibido: ${pattern}`);
      }
    }
  }
  return violations;
}

function checkClinicalScripts() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const violations = [];
  for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
    if (['stack:dev', 'stack:up', 'dev:web', 'dev:api', 'build', 'check'].includes(name)) {
      if (/evolab/i.test(cmd) && !name.startsWith('evolab:')) {
        violations.push(`script ${name} referencia evolab: ${cmd}`);
      }
    }
  }
  return violations;
}

function main() {
  console.log('EPIS2 evolab:boundary:validate\n');
  const violations = [];

  for (const app of CLINICAL_APPS) {
    violations.push(...scanImports(app, FORBIDDEN_CLINICAL_IMPORTS));
  }

  violations.push(...scanImports(EVOLAB_APP, FORBIDDEN_EVOLAB_IMPORTS));
  violations.push(...checkClinicalScripts());

  if (!existsSync(join(ROOT, EVOLAB_APP))) {
    violations.push('apps/evolution-lab no existe');
  }

  if (violations.length > 0) {
    console.error('Violaciones de frontera:\n');
    for (const v of violations) {
      console.error(`  ✗ ${v}`);
    }
    console.error(`\nevolab:boundary:validate FAILED (${violations.length})`);
    return 1;
  }

  console.log('  ✓ apps/web sin imports Evolab');
  console.log('  ✓ apps/api sin imports Evolab');
  console.log('  ✓ evolution-lab sin imports clínicos internos');
  console.log('  ✓ scripts clínicos no levantan Evolab');
  console.log('\nevolab:boundary:validate OK');
  return 0;
}

process.exit(main());
