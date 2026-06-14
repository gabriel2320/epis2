import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function gatesDirFrom(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}

export function repoRootFromGatesDir(gatesDir) {
  return join(gatesDir, '../..');
}

export function loadCatalogFile(gatesDir, preferFull = true) {
  const names = preferFull
    ? ['catalog-full.json', 'catalog.json']
    : ['catalog.json', 'catalog-full.json'];
  for (const name of names) {
    const path = join(gatesDir, name);
    if (existsSync(path)) {
      return { path, data: JSON.parse(readFileSync(path, 'utf8')) };
    }
  }
  return null;
}

export function buildCatalogFromPackage(pkg) {
  const gates = {};
  for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
    if (!name.startsWith('quality:')) continue;
    const cmd = String(command).trim();
    if (cmd.startsWith('node tools/gates/run-legacy.mjs')) continue;

    const fileMatch = /^node scripts\/quality\/(validate-[\w-]+\.mjs)/.exec(cmd);
    if (fileMatch) {
      gates[name] = { type: 'file', path: `scripts/quality/${fileMatch[1]}` };
      continue;
    }
    const loose = cmd.match(/scripts\/quality\/[\w-]+\.mjs/);
    if (loose) {
      gates[name] = { type: 'file', path: loose[0] };
      continue;
    }
    if (cmd.startsWith('node scripts/quality/')) {
      const any = cmd.match(/scripts\/quality\/[\w-]+\.mjs/);
      if (any) {
        gates[name] = { type: 'file', path: any[0] };
        continue;
      }
    }
    if (cmd.startsWith('npm run') || cmd.includes(' && ') || cmd.includes('vitest')) {
      gates[name] = { type: 'npm', command: cmd };
    }
  }
  return gates;
}

export function mergeCatalog(existing, fromPkg) {
  const gates = { ...(existing?.gates ?? {}) };
  for (const [name, entry] of Object.entries(fromPkg)) {
    if (!gates[name]) gates[name] = entry;
  }
  return gates;
}

export function writeCatalog(gatesDir, gates, source) {
  const out = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source,
    note: 'Regenerar: npm run tool:gates:sync-catalog',
    gates,
  };
  writeFileSync(join(gatesDir, 'catalog.json'), JSON.stringify(out, null, 2) + '\n');
  const fullPath = join(gatesDir, 'catalog-full.json');
  if (existsSync(fullPath)) {
    const full = JSON.parse(readFileSync(fullPath, 'utf8'));
    full.generatedAt = out.generatedAt;
    full.gates = mergeCatalog(full, gates);
    writeFileSync(fullPath, JSON.stringify(full, null, 2) + '\n');
  }
  return out;
}
