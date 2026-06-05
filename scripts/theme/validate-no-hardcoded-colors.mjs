#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';

const SCAN_ROOTS = [
  path.join(REPO_ROOT, 'apps/web/src'),
  path.join(REPO_ROOT, 'packages/epis2-ui/src'),
];

const ALLOWLIST_DIRS = [
  'theme/source',
  'theme/generated',
  'theme/clinical',
  'theme/contracts',
  'theme/color-roles.ts',
  'theme/clinical-roles.ts',
  'theme/visual-identity.ts',
  'theme/chip-tones.ts',
  'theme/palette-legacy.ts',
  'theme/typography-rules.ts',
  'pages/dev',
];

const HEX = /#[0-9A-Fa-f]{3,8}\b/g;

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      await walk(full, files);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.includes('.test.')) {
      files.push(full);
    }
  }
  return files;
}

function isAllowlisted(rel) {
  return ALLOWLIST_DIRS.some((a) => rel.includes(a.replace(/\//g, path.sep)));
}

export async function validateNoHardcodedColors() {
  const violations = [];
  for (const root of SCAN_ROOTS) {
    const files = await walk(root);
    for (const file of files) {
      const rel = path.relative(REPO_ROOT, file);
      if (isAllowlisted(rel)) continue;
      const content = await fs.readFile(file, 'utf8');
      const matches = content.match(HEX);
      if (matches?.length) {
        violations.push(`${rel} → ${matches.length} hex hardcodeado(s): ${[...new Set(matches)].join(', ')}`);
      }
    }
  }
  return { ok: violations.length === 0, violations };
}

async function main() {
  const result = await validateNoHardcodedColors();
  if (!result.ok) {
    console.error('validate-no-hardcoded-colors FAILED');
    for (const v of result.violations) console.error(`  - ${v}`);
    process.exit(1);
  }
  console.log('validate-no-hardcoded-colors OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
