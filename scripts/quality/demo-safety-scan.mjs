/**
 * PROG-DEMO-SAFETY — scan fixtures/seeds y checks estáticos demo safety.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const RUT_REAL_LOOKING = /\b[12]\d{3}\.\d{3}\.\d{3}-[\dkK]\b/;
const REAL_EMAIL_DOMAINS =
  /@(gmail|hotmail|yahoo|outlook|live|icloud|protonmail|office365)\.[a-z]{2,}/i;

/** Seeds SQL con RUT ficticios documentados — no PHI. */
const RUT_ALLOWLIST_FILES = new Set([
  'database/migrations/007_demo_rut_identifiers.sql',
]);

const FIXTURE_SCAN_ROOTS = [
  'packages/test-fixtures/src',
  'apps/web/src/fixtures',
];

const FIXTURE_SCAN_SQL = [
  'database/migrations/004_seed_synthetic.sql',
  'database/migrations/006_demo_five_cases.sql',
  'database/migrations/007_demo_rut_identifiers.sql',
  'database/migrations/009_v1_longitudinal_seed.sql',
  'database/migrations/011_v2_inpatient_seed.sql',
  'database/migrations/013_v2_clinical_orders_seed.sql',
  'database/migrations/016_v4_interop_staging_seed.sql',
  'database/migrations/018_demo005_chart_seed.sql',
  'database/migrations/042_sim_clinical_cases_seed.sql',
];

function walkFiles(dirRel, extensions) {
  const dir = join(root, dirRel);
  if (!existsSync(dir)) return [];
  /** @type {string[]} */
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = `${dirRel}/${entry.name}`.replace(/\\/g, '/');
    if (entry.isDirectory()) {
      files.push(...walkFiles(rel, extensions));
      continue;
    }
    const ext = entry.name.includes('.') ? entry.name.slice(entry.name.lastIndexOf('.')) : '';
    if (extensions.has(ext)) files.push(rel);
  }
  return files;
}

function scanFixtureFile(rel, errors) {
  const content = readFileSync(join(root, rel), 'utf8');
  if (REAL_EMAIL_DOMAINS.test(content)) {
    errors.push(`${rel}: posible email real (dominio personal/corporativo)`);
  }
  if (RUT_REAL_LOOKING.test(content) && !RUT_ALLOWLIST_FILES.has(rel)) {
    errors.push(`${rel}: RUT con formato real sin allowlist demo`);
  }
}

export function collectDemoSafetyDocErrors() {
  const errors = [];

  const bannerPath = 'apps/web/src/components/demo/EpisDemoEnvironmentBanner.tsx';
  if (!existsSync(join(root, bannerPath))) {
    errors.push(`Falta ${bannerPath}`);
  }

  const providersPath = join(root, 'apps/web/src/AppProviders.tsx');
  if (!existsSync(providersPath)) {
    errors.push('Falta apps/web/src/AppProviders.tsx');
  } else {
    const providers = readFileSync(providersPath, 'utf8');
    if (!providers.includes('EpisDemoEnvironmentBanner')) {
      errors.push('AppProviders debe montar EpisDemoEnvironmentBanner');
    }
  }

  const copyPath = join(root, 'packages/design-system/src/copy/es.ts');
  if (!existsSync(copyPath) || !readFileSync(copyPath, 'utf8').includes('demoEnvironmentBanner')) {
    errors.push('copy/es.ts falta demoEnvironmentBanner');
  }

  const configPath = join(root, 'apps/api/src/config.ts');
  if (!existsSync(configPath)) {
    errors.push('Falta apps/api/src/config.ts');
  } else {
    const config = readFileSync(configPath, 'utf8');
    if (!config.includes('isDemoAuthEnabled')) {
      errors.push('config.ts falta isDemoAuthEnabled');
    }
    if (!config.includes('AUTH_MODE === \'demo\'')) {
      errors.push('config.ts falta guard AUTH_MODE=demo en deployed');
    }
  }

  const configTestPath = join(root, 'apps/api/src/config.test.ts');
  if (!existsSync(configTestPath)) {
    errors.push('Falta apps/api/src/config.test.ts');
  } else {
    const tests = readFileSync(configTestPath, 'utf8');
    if (!tests.includes('bloquea demo en staging')) {
      errors.push('config.test.ts falta caso killswitch staging');
    }
  }

  const printA5 = join(root, 'packages/epis2-ui/src/print/PrintA5Document.tsx');
  const printLetter = join(root, 'packages/epis2-ui/src/print/PrintLetterDocument.tsx');
  if (!existsSync(printA5) || !readFileSync(printA5, 'utf8').includes('PrintDemoWatermark')) {
    errors.push('PrintA5Document debe incluir PrintDemoWatermark');
  }
  if (!existsSync(printLetter) || !readFileSync(printLetter, 'utf8').includes('PrintDemoWatermark')) {
    errors.push('PrintLetterDocument debe incluir PrintDemoWatermark');
  }

  return errors;
}

export function collectDemoSafetyFixtureErrors() {
  const errors = [];
  const codeExt = new Set(['.ts', '.tsx', '.js', '.mjs']);

  for (const dir of FIXTURE_SCAN_ROOTS) {
    for (const rel of walkFiles(dir, codeExt)) {
      scanFixtureFile(rel, errors);
    }
  }

  for (const rel of FIXTURE_SCAN_SQL) {
    if (!existsSync(join(root, rel))) continue;
    scanFixtureFile(rel, errors);
  }

  return errors;
}

export function collectDemoSafetyErrors() {
  return [...collectDemoSafetyDocErrors(), ...collectDemoSafetyFixtureErrors()];
}
