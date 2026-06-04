#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { REPOS, SKIP_DIR_NAMES, FORBIDDEN_PATTERNS } from './paths.mjs';

const OUT = path.join(REPOS.EPIS2, 'migration', 'reports', 'forbidden-deps-latest.json');

function* walk(root) {
  const stack = [root];
  while (stack.length) {
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
      else if (/package\.json$/i.test(ent.name)) yield full;
    }
  }
}

const findings = [];

for (const [name, root] of Object.entries(REPOS)) {
  if (name === 'EPIS2' || !fs.existsSync(root)) continue;
  for (const pkgPath of walk(root)) {
    let text;
    try {
      text = fs.readFileSync(pkgPath, 'utf8');
    } catch {
      continue;
    }
    for (const pat of FORBIDDEN_PATTERNS.filter((p) => p.id.includes('dep'))) {
      if (pat.re.test(text)) {
        findings.push({
          project: name,
          file: pkgPath,
          type: pat.id,
          severity: pat.severity,
          label: pat.label,
        });
      }
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ scannedAt: new Date().toISOString(), findings }, null, 2));
console.log(`forbidden-deps: ${findings.length} hallazgos → ${OUT}`);
process.exit(findings.some((f) => f.severity === 'critical') ? 0 : 0);
