#!/usr/bin/env node
/** Regenera tools/gates/catalog.json desde package.json (quality:* → validate-*.mjs). */
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const gates = {};

for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
  if (!name.startsWith('quality:')) continue;
  const fileMatch = /^node scripts\/quality\/(validate-[\w-]+\.mjs)/.exec(String(command).trim());
  if (fileMatch) {
    gates[name] = { type: 'file', path: `scripts/quality/${fileMatch[1]}` };
    continue;
  }
  if (String(command).includes('node scripts/quality/')) {
    const loose = String(command).match(/scripts\/quality\/[\w-]+\.mjs/);
    if (loose) {
      gates[name] = { type: 'file', path: loose[0] };
      continue;
    }
  }
  if (String(command).startsWith('npm run')) {
    gates[name] = { type: 'npm', command: String(command) };
  }
}

const out = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  source: 'package.json',
  note: 'Regenerar: npm run tool:gates:sync-catalog',
  gates,
};

const outPath = join(dirname(fileURLToPath(import.meta.url)), 'catalog.json');
writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(`catalog.json OK — ${Object.keys(gates).length} entradas quality:*`);
