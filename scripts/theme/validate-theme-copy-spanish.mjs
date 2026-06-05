#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';

const FORBIDDEN_CLINICAL = [
  /\bOllama\b/,
  /\bRAG\b/,
  /\bembeddings\b/i,
  /\bpgvector\b/i,
  /\btokens\b/i,
  /\btemperature\b/i,
];

const SCAN = [
  path.join(REPO_ROOT, 'packages/design-system/src/copy/es.ts'),
  path.join(REPO_ROOT, 'packages/command-registry/src/chips.ts'),
];

async function main() {
  const errors = [];
  for (const file of SCAN) {
    const content = await fs.readFile(file, 'utf8');
    const rel = path.relative(REPO_ROOT, file);
    for (const pattern of FORBIDDEN_CLINICAL) {
      if (pattern.test(content)) {
        errors.push(`${rel}: microcopy prohibido ${pattern}`);
      }
    }
  }

  if (errors.length) {
    console.error('validate-theme-copy-spanish FAILED');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('validate-theme-copy-spanish OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
