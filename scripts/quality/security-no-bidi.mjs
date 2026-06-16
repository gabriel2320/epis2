#!/usr/bin/env node
/**
 * Fail on bidirectional / embedding Unicode controls in tracked text.
 * Equivalent to: git grep -nP "[\x{202A}-\x{202E}\x{2066}-\x{2069}]" -- .
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BIDI = /[\u202A-\u202E\u2066-\u2069]/;
const TEXT =
  /\.(ts|tsx|js|jsx|mjs|cjs|json|md|yml|yaml|toml|sql|css|scss|html|sh|txt)$/i;
const SKIP =
  /^(node_modules\/|reports\/|e2e\/.*-snapshots\/|.*\.png$|.*\.jpg$|.*\.webp$|.*\.gif$)/;

const files = execSync('git ls-files', { cwd: root, encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter((rel) => rel && TEXT.test(rel) && !SKIP.test(rel));

const hits = [];
for (const rel of files) {
  let content;
  try {
    content = readFileSync(join(root, rel), 'utf8');
  } catch {
    continue;
  }
  const match = content.match(BIDI);
  if (!match) continue;
  const index = content.search(BIDI);
  const line = content.slice(0, index).split('\n').length;
  hits.push({
    rel,
    line,
    char: `U+${match[0].codePointAt(0).toString(16).toUpperCase()}`,
  });
}

if (hits.length) {
  console.error('security:no-bidi FAILED — bidirectional/embedding Unicode controls:');
  for (const h of hits) {
    console.error(`  ${h.rel}:${h.line} (${h.char})`);
  }
  process.exit(1);
}

console.log(`security:no-bidi OK (${files.length} tracked text files)`);
