#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';

const CREATE_THEME_FILE = path.join(
  REPO_ROOT,
  'packages/epis2-ui/src/theme/create-epis2-theme.ts',
);

export async function validateSingleTheme() {
  const content = await fs.readFile(CREATE_THEME_FILE, 'utf8');
  const hasGenerator = content.includes('export function createEpis2Theme');
  const details = [];
  if (!hasGenerator) details.push('create-epis2-theme.ts sin createEpis2Theme');

  return {
    ok: details.length === 0,
    message: details.length === 0 ? 'Un solo generador de tema EPIS2' : 'Generador de tema ausente',
    details,
  };
}

async function main() {
  const result = await validateSingleTheme();
  if (!result.ok) {
    console.error('validate-single-theme FAILED');
    for (const d of result.details) console.error(`  - ${d}`);
    process.exit(1);
  }
  console.log('validate-single-theme OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
