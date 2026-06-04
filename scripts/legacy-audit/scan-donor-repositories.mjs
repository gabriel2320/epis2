#!/usr/bin/env node
/**
 * Escaneo de solo lectura de repositorios donantes EPIS / EPIDOS / EPIONE.
 * No modifica donantes. No imprime secretos completos.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { REPOS, SKIP_DIR_NAMES } from './paths.mjs';

const OUT = path.join(REPOS.EPIS2, 'migration', 'reports', 'donor-scan-latest.json');

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function gitMeta(root) {
  if (!exists(path.join(root, '.git'))) {
    return { git: false };
  }
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const head = execSync('git log -1 --format=%H', { cwd: root, encoding: 'utf8' }).trim();
    const oneline = execSync('git log -1 --oneline', { cwd: root, encoding: 'utf8' }).trim();
    const status = execSync('git status -sb', { cwd: root, encoding: 'utf8' }).trim();
    const dirty = status.split('\n').filter((l) => l.startsWith(' M') || l.startsWith('??')).length;
    return { git: true, branch, head, oneline, dirtyFileCount: dirty, statusFirstLine: status.split('\n')[0] };
  } catch (e) {
    return { git: true, error: String(e.message) };
  }
}

function walkFiles(root, maxFiles = 25000) {
  const files = [];
  const stack = [root];
  while (stack.length && files.length < maxFiles) {
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
      else if (ent.isFile()) files.push(full);
      if (files.length >= maxFiles) break;
    }
  }
  return { files, truncated: files.length >= maxFiles };
}

function extStats(files) {
  const map = new Map();
  for (const f of files) {
    const ext = path.extname(f).toLowerCase() || '(sin ext)';
    map.set(ext, (map.get(ext) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([ext, count]) => ({ ext, count }));
}

function topLevel(root) {
  if (!exists(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIR_NAMES.has(d.name))
    .map((d) => d.name)
    .sort();
}

const report = {
  scannedAt: new Date().toISOString(),
  destination: REPOS.EPIS2,
  repositories: {},
};

for (const [name, root] of Object.entries(REPOS)) {
  if (name === 'EPIS2') continue;
  if (!exists(root)) {
    report.repositories[name] = { status: 'NOT_FOUND', path: root };
    continue;
  }
  const { files, truncated } = walkFiles(root);
  const hasPkg = exists(path.join(root, 'package.json'));
  report.repositories[name] = {
    status: 'FOUND',
    path: root,
    topLevel: topLevel(root),
    packageManager: hasPkg ? 'npm' : 'unknown',
    fileCountApprox: files.length,
    fileScanTruncated: truncated,
    extensionsTop: extStats(files),
    git: gitMeta(root),
  };
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2), 'utf8');
console.log(`legacy:audit scan → ${OUT}`);
for (const [k, v] of Object.entries(report.repositories)) {
  console.log(`  ${k}: ${v.status}${v.fileCountApprox != null ? ` (${v.fileCountApprox} archivos)` : ''}`);
}
