#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { REPOS, SKIP_DIR_NAMES, SECRET_PATTERNS, PHI_HINT_PATTERNS } from './paths.mjs';

const OUT = path.join(REPOS.EPIS2, 'migration', 'reports', 'secrets-scan-latest.json');
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.env', '.yaml', '.yml', '.md', '.sql']);

function* walk(root, limit = 8000) {
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
      if (ent.name === '.env' || ent.name === '.env.local') continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else {
        const ext = path.extname(ent.name).toLowerCase();
        if (TEXT_EXT.has(ext) || ent.name.startsWith('.env')) {
          yield full;
          n++;
        }
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
    if (text.length > 500_000) continue;
    for (const pat of [...SECRET_PATTERNS, ...PHI_HINT_PATTERNS]) {
      if (pat.re.test(text)) {
        findings.push({
          project: name,
          file,
          type: pat.id,
          severity: pat.severity,
          label: pat.label ?? pat.id,
        });
        break;
      }
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ scannedAt: new Date().toISOString(), count: findings.length, findings }, null, 2));
console.log(`secrets-scan: ${findings.length} hallazgos (sin contenido) → ${OUT}`);
