#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { REPOS, SKIP_DIR_NAMES } from './paths.mjs';

const OUT = path.join(REPOS.EPIS2, 'migration', 'reports', 'legacy-routes-latest.json');
const ROUTE_RE = /\/home\/epis-|\/openmrs\/|dashboard['"]?\s*:\s*true|path:\s*['"]\/home['"]/gi;

function* walk(root, limit = 10000) {
  let n = 0;
  const stack = [root];
  while (stack.length && n < limit) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      if (SKIP_DIR_NAMES.has(ent.name)) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (/\.(ts|tsx|js|json|mjs)$/i.test(ent.name)) {
        yield full;
        n++;
      }
    }
  }
}

const findings = [];

for (const [name, root] of Object.entries(REPOS)) {
  if (name === 'EPIS2' || !fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const matches = text.match(ROUTE_RE);
    if (matches?.length) {
      findings.push({
        project: name,
        file,
        severity: name === 'EPIS' ? 'expected-legacy' : 'warning',
        matchCount: matches.length,
        samples: [...new Set(matches)].slice(0, 5),
      });
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ scannedAt: new Date().toISOString(), findings }, null, 2));
console.log(`legacy-routes: ${findings.length} archivos → ${OUT}`);
