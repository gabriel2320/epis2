#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { REPOS } from './paths.mjs';

const QUARANTINE = path.join(REPOS.EPIS2, 'migration', 'candidates');
const FORBIDDEN_IMPORT = [
  /@openmrs\//i,
  /@carbon\b/i,
  /openmrs-esm/i,
  /from\s+['"]react-router-dom['"]/i,
];
const REQUIRED_FILES = ['SOURCE.md', 'REVIEW.md'];

let fail = 0;

if (!fs.existsSync(QUARANTINE)) {
  console.error('Falta migration/candidates/');
  process.exit(1);
}

function* walkDirs(base) {
  for (const project of fs.readdirSync(base, { withFileTypes: true })) {
    if (!project.isDirectory()) continue;
    const projectDir = path.join(base, project.name);
    for (const cand of fs.readdirSync(projectDir, { withFileTypes: true })) {
      if (!cand.isDirectory()) continue;
      yield path.join(projectDir, cand.name);
    }
  }
}

for (const candDir of walkDirs(QUARANTINE)) {
  const name = path.basename(candDir);
  for (const req of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(candDir, req))) {
      console.error(`${name}: falta ${req}`);
      fail++;
    }
  }
  if (!fs.existsSync(path.join(candDir, 'SOURCE.md'))) continue;
  const stack = [path.join(candDir, 'original'), path.join(candDir, 'proposed')];
  while (stack.length) {
    const dir = stack.pop();
    if (!fs.existsSync(dir)) continue;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (/\.(ts|tsx|js|mjs)$/.test(ent.name)) {
        const text = fs.readFileSync(full, 'utf8');
        for (const re of FORBIDDEN_IMPORT) {
          if (re.test(text)) {
            console.error(`${name}: import prohibido en ${full}`);
            fail++;
          }
        }
      }
    }
  }
}

console.log(`quarantine validate: ${fail} errores`);
process.exit(fail ? 1 : 0);
