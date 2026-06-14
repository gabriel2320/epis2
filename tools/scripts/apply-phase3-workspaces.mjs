#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE Fase 3 — db:* → @epis2/api, test:e2e* → @epis2/web.
 *   npm run tool:workspaces:apply-phase3
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const rootPkgPath = join(root, 'package.json');
const apiPkgPath = join(root, 'apps/api/package.json');
const webPkgPath = join(root, 'apps/web/package.json');

const DB_SCRIPTS = {
  'db:migrate': 'node ../../scripts/db-migrate.mjs',
  'db:validate': 'node ../../scripts/db-validate.mjs',
  'db:reindex-chunks': 'node ../../scripts/db/reindex-document-chunks.mjs',
  'db:backup': 'node ../../scripts/epis-db-backup.mjs',
  'db:restore': 'node ../../scripts/epis-db-restore.mjs',
  'db:apply-latest': 'node ../../scripts/quality/apply-latest-migration.mjs',
};

/** Root mantiene alias fino hacia workspace (CI + docs). */
const ROOT_DB_SHIMS = {
  'db:migrate': 'npm run db:migrate -w @epis2/api',
  'db:validate': 'npm run db:validate -w @epis2/api',
};

const ROOT_E2E_SHIMS = new Set([
  'test:e2e',
  'test:e2e:install',
  'test:e2e:dual-chart',
  'test:e2e:ux-g02',
  'test:e2e:login-gateway',
]);

function e2eCommand(specArgs) {
  return `node ../../tools/scripts/run-e2e.mjs ${specArgs}`.trim();
}

const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
const apiPkg = JSON.parse(readFileSync(apiPkgPath, 'utf8'));
const webPkg = JSON.parse(readFileSync(webPkgPath, 'utf8'));

apiPkg.scripts = { ...(apiPkg.scripts ?? {}), ...DB_SCRIPTS };

const webE2e = {
  'test:e2e:install': 'playwright install chromium',
  'test:e2e': e2eCommand(
    'e2e/golden-command-evolution.spec.ts e2e/golden-draft-approval.spec.ts e2e/golden-v2-admission-discharge.spec.ts e2e/clinical-textbox-evolution-draft.spec.ts e2e/login-gateway.spec.ts e2e/ux-g02-command-first.spec.ts e2e/three-modes-journey.spec.ts e2e/ola6a-print-certificate.spec.ts e2e/ola6a-print-prescription.spec.ts e2e/ola6a-print-discharge-summary.spec.ts e2e/ola6a-print-orders.spec.ts e2e/a11y-smoke.spec.ts e2e/mobile-drawer.spec.ts',
  ),
  'test:e2e:print': e2eCommand(
    'e2e/ola6a-print-certificate.spec.ts e2e/ola6a-print-prescription.spec.ts e2e/ola6a-print-discharge-summary.spec.ts e2e/ola6a-print-orders.spec.ts',
  ),
  'test:e2e:golden-v2': e2eCommand('e2e/golden-v2-admission-discharge.spec.ts'),
  'test:e2e:dual-chart': e2eCommand('e2e/dual-chart-modes.spec.ts'),
  'test:e2e:ux-g02': e2eCommand('e2e/ux-g02-command-first.spec.ts'),
  'test:e2e:login-gateway': e2eCommand('e2e/login-gateway.spec.ts'),
  'test:e2e:clinical-textbox': e2eCommand('e2e/clinical-textbox-evolution-draft.spec.ts'),
  'test:e2e:a11y': e2eCommand('e2e/a11y-smoke.spec.ts'),
  'test:e2e:mobile': e2eCommand('e2e/mobile-drawer.spec.ts'),
  'test:e2e:tramo-c-admission': e2eCommand('e2e/tramo-c-admission.spec.ts'),
  'test:e2e:tramo-c-trends': e2eCommand('e2e/tramo-c-trends.spec.ts'),
  'test:e2e:tramo-c-mar': e2eCommand('e2e/tramo-c-mar.spec.ts'),
  'test:e2e:tramo-f': e2eCommand('e2e/tramo-f-aps.spec.ts'),
  'test:e2e:tramo-g': e2eCommand('e2e/tramo-g-icu.spec.ts'),
  'test:e2e:tramo-h': e2eCommand('e2e/tramo-h-iaas.spec.ts'),
  'test:e2e:tramo-i': e2eCommand('e2e/tramo-i-specialty.spec.ts'),
  'test:e2e:tramo-j': e2eCommand('e2e/tramo-j-pharmacy.spec.ts'),
  'test:e2e:tramo-k': e2eCommand('e2e/tramo-k-quality.spec.ts'),
  'test:e2e:week3': e2eCommand('e2e/week3-ai-tramo-j.spec.ts'),
  'test:e2e:tramo-d': e2eCommand('e2e/tramo-d-icu.spec.ts'),
  'test:e2e:tramo-e': e2eCommand('e2e/tramo-e-or.spec.ts'),
  'test:e2e:tramo-b': e2eCommand('e2e/tramo-b-reception.spec.ts'),
  'test:e2e:tramo-c': e2eCommand('e2e/tramo-c-emergency.spec.ts'),
  'test:e2e:ola2': e2eCommand('e2e/ola2-ambulatory-m3-ui.spec.ts'),
  'test:e2e:ola1c': e2eCommand('e2e/ola1c-results-journey.spec.ts'),
  'test:e2e:ola3': e2eCommand('e2e/ola3-ficha-journey.spec.ts'),
  'test:e2e:three-modes': e2eCommand('e2e/three-modes-journey.spec.ts'),
};

webPkg.scripts = { ...(webPkg.scripts ?? {}), ...webE2e };

const scripts = { ...(rootPkg.scripts ?? {}) };
let removedE2e = 0;
let removedDb = 0;

for (const name of Object.keys(scripts)) {
  if (name.startsWith('test:e2e')) {
    if (ROOT_E2E_SHIMS.has(name)) {
      scripts[name] = `npm run ${name} -w @epis2/web`;
    } else {
      delete scripts[name];
      removedE2e++;
    }
    continue;
  }
  if (name.startsWith('db:')) {
    if (ROOT_DB_SHIMS[name]) {
      scripts[name] = ROOT_DB_SHIMS[name];
    } else {
      delete scripts[name];
      removedDb++;
    }
  }
}

rootPkg.scripts = scripts;
writeFileSync(apiPkgPath, JSON.stringify(apiPkg, null, 2) + '\n');
writeFileSync(webPkgPath, JSON.stringify(webPkg, null, 2) + '\n');
writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');

console.log(
  `phase3-workspaces OK — api db:* ${Object.keys(DB_SCRIPTS).length}, web e2e ${Object.keys(webE2e).length}`,
);
console.log(`  root removed: ${removedE2e} test:e2e*, ${removedDb} db:*`);
console.log(`  root shims: db:migrate/validate, test:e2e (+ wired CI/catalog)`);
console.log('  Otros E2E: npm run test:e2e:tramo-j -w @epis2/web');
