#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { REPOS, SKIP_DIR_NAMES } from './paths.mjs';

const OUT = path.join(REPOS.EPIS2, 'migration', 'reports', 'duplicate-registries-latest.json');

const MARKERS = [
  { id: 'command-registry', re: /commandRegistry|COMMAND_REGISTRY|command-registry/i },
  { id: 'form-registry', re: /formRegistry|FORM_REGISTRY|form-registry|form-definitions/i },
  { id: 'action-registry', re: /action-registry|actionRegistry|ACTION_REGISTRY/i },
  { id: 'intent-resolver', re: /intent-resolver|intentResolver|resolveIntent/i },
  { id: 'medical-action-universe', re: /medical-action-universe|MedicalActionUniverse/i },
];

function* walk(root, limit = 12000) {
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
      else if (/\.(ts|tsx|js|mjs)$/i.test(ent.name)) {
        yield full;
        n++;
      }
    }
  }
}

const byProject = {};

for (const [name, root] of Object.entries(REPOS)) {
  if (name === 'EPIS2' || !fs.existsSync(root)) continue;
  const hits = {};
  for (const marker of MARKERS) hits[marker.id] = [];
  for (const file of walk(root)) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const marker of MARKERS) {
      if (marker.re.test(text)) hits[marker.id].push(file);
    }
  }
  byProject[name] = Object.fromEntries(
    Object.entries(hits).map(([k, v]) => [k, { count: v.length, sample: v.slice(0, 8) }]),
  );
}

const epis2Registry = path.join(REPOS.EPIS2, 'packages', 'command-registry');
const epis2Forms = path.join(REPOS.EPIS2, 'packages', 'clinical-forms');

const report = {
  scannedAt: new Date().toISOString(),
  epis2Canonical: {
    commandRegistry: fs.existsSync(epis2Registry),
    clinicalForms: fs.existsSync(epis2Forms),
  },
  donors: byProject,
  warnings: [],
};

for (const [proj, data] of Object.entries(byProject)) {
  if (data['command-registry']?.count > 2) {
    report.warnings.push({
      project: proj,
      issue: 'Múltiples archivos con command-registry',
      count: data['command-registry'].count,
    });
  }
  if (data['form-registry']?.count > 3) {
    report.warnings.push({
      project: proj,
      issue: 'Múltiples form registries',
      count: data['form-registry'].count,
    });
  }
  if (data['intent-resolver']?.count > 5) {
    report.warnings.push({
      project: proj,
      issue: 'Resolvers de intent dispersos',
      count: data['intent-resolver'].count,
    });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(`duplicate-registries → ${OUT} (${report.warnings.length} advertencias)`);
