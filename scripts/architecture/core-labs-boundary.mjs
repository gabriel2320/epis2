import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { walkSourceFiles } from './lib/scan-sources.mjs';

/** PROG-CORE-LABS-FW — labs in-repo no importables desde core producto. */
export const CORE_LABS_FORBIDDEN_PACKAGES = ['@epis2/clinical-case-intel', '@epis2/drug-intel'];

export const CORE_LABS_FORBIDDEN_PATHS = [
  'services/clinical-case-intel',
  'services/drug-intel',
];

const CORE_PACKAGE_JSON_ROOTS = ['apps/web', 'apps/api'];

const SOURCE_SCAN_SKIP = [
  '/fixtures/devFixturesBridge.',
];

function listPackageDirs() {
  const packagesDir = join(REPO_ROOT, 'packages');
  if (!existsSync(packagesDir)) return [];
  return readdirSync(packagesDir)
    .filter((name) => existsSync(join(packagesDir, name, 'package.json')))
    .map((name) => `packages/${name}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function importPatternsForModule(moduleId) {
  const escaped = escapeRegExp(moduleId);
  return [
    new RegExp(`from\\s+['"]${escaped}['"]`),
    new RegExp(`import\\s+['"]${escaped}['"]`),
    new RegExp(`import\\s*\\(\\s*['"]${escaped}['"]`),
    new RegExp(`require\\s*\\(\\s*['"]${escaped}['"]`),
  ];
}

const FORBIDDEN_IMPORT_PATTERNS = [
  ...CORE_LABS_FORBIDDEN_PACKAGES.flatMap(importPatternsForModule),
  ...CORE_LABS_FORBIDDEN_PATHS.flatMap((path) => [
    new RegExp(`from\\s+['"][^'"]*${escapeRegExp(path)}`),
    new RegExp(`import\\s+['"][^'"]*${escapeRegExp(path)}`),
    new RegExp(`import\\s*\\(\\s*['"][^'"]*${escapeRegExp(path)}`),
    new RegExp(`require\\s*\\(\\s*['"][^'"]*${escapeRegExp(path)}`),
  ]),
];

function shouldSkipSourceScan(rel) {
  if (rel.endsWith('package.json')) return true;
  return SOURCE_SCAN_SKIP.some((needle) => rel.includes(needle));
}

function scanPackageJsonDeps(relPkgJson, errors) {
  const fullPath = join(REPO_ROOT, relPkgJson);
  if (!existsSync(fullPath)) return;
  const pkg = JSON.parse(readFileSync(fullPath, 'utf8'));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.optionalDependencies,
  };
  for (const dep of Object.keys(allDeps)) {
    if (CORE_LABS_FORBIDDEN_PACKAGES.includes(dep)) {
      errors.push(`${relPkgJson}: workspace dep prohibida (${dep})`);
    }
  }
}

function scanSourceContent(rel, content, errors) {
  for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
    if (pattern.test(content)) {
      errors.push(`${rel}: import/runtime labs prohibido (${pattern.source})`);
      break;
    }
  }
}

/**
 * Valida que apps/web, apps/api y packages/* no importen labs in-repo.
 * @returns {Promise<string[]>} lista de errores
 */
export async function collectCoreLabsBoundaryErrors() {
  const errors = [];

  for (const rel of CORE_PACKAGE_JSON_ROOTS) {
    scanPackageJsonDeps(`${rel}/package.json`, errors);
  }
  for (const rel of listPackageDirs()) {
    scanPackageJsonDeps(`${rel}/package.json`, errors);
  }

  const scanRoots = [...CORE_PACKAGE_JSON_ROOTS, ...listPackageDirs()];
  for await (const { rel, content } of walkSourceFiles({ roots: scanRoots })) {
    if (shouldSkipSourceScan(rel)) continue;
    scanSourceContent(rel, content, errors);
  }

  return errors;
}

export async function validateCoreLabsBoundary() {
  const details = await collectCoreLabsBoundaryErrors();
  return details.length ? { ok: false, details } : { ok: true };
}
