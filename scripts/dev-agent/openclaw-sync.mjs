#!/usr/bin/env node
/**
 * Índice artefactos OpenClaw auto-dev → reports/openclaw-auto-dev-index.json
 *
 *   npm run dev:openclaw:sync
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isOpenClawAutoDevEnabled } from './openclaw-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outPath = join(root, 'reports/openclaw-auto-dev-index.json');

function listArtifacts(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    out.push({
      path: prefix ? `${prefix}/${name}` : name,
      mtime: st.mtime.toISOString(),
      bytes: st.size,
    });
  }
  return out.sort((a, b) => b.mtime.localeCompare(a.mtime));
}

function readLatest(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return null;
  const st = statSync(p);
  return { path: rel, mtime: st.mtime.toISOString(), bytes: st.size };
}

function main() {
  const runDir = join(root, '.agent-runs/openclaw');
  const artifacts = listArtifacts(runDir, '.agent-runs/openclaw');
  const latestBrief = readLatest('reports/archive/2026-06/openclaw-latest-brief.md');
  const latestHandoff = readLatest('reports/archive/2026-06/openclaw-latest-handoff.md');

  const payload = {
    syncedAt: new Date().toISOString(),
    autoDevEnabled: isOpenClawAutoDevEnabled(),
    artifactCount: artifacts.length,
    artifacts: artifacts.slice(0, 40),
    latestBrief,
    latestHandoff,
  };

  mkdirSync(join(root, 'reports'), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    `dev:openclaw:sync OK — ${artifacts.length} artefacto(s) · latest brief=${latestBrief ? 'yes' : 'no'} handoff=${latestHandoff ? 'yes' : 'no'}`,
  );
  console.log(`→ ${outPath}`);
}

main();
