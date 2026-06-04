import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import {
  REPO_ROOT,
  SCAN_EXTENSIONS,
  SCAN_IGNORE_DIRS,
  SCAN_ROOTS,
  isLegacyDoc,
} from './paths.mjs';

/**
 * @returns {AsyncGenerator<{ path: string, rel: string, content: string }>}
 */
export async function* walkSourceFiles(options = {}) {
  const {
    roots = SCAN_ROOTS,
    extraIgnore = [],
    includeScriptsArchitecture = false,
  } = options;

  const ignore = new Set([...SCAN_IGNORE_DIRS, ...extraIgnore]);

  async function* walk(dir, relBase) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (ignore.has(entry.name)) continue;
        if (rel === 'scripts/architecture' && !includeScriptsArchitecture) continue;
        yield* walk(join(dir, entry.name), rel);
        continue;
      }
      const ext = entry.name.includes('.') ? entry.name.slice(entry.name.lastIndexOf('.')) : '';
      if (!SCAN_EXTENSIONS.has(ext)) continue;
      if (isLegacyDoc(rel)) continue;
      const path = join(dir, entry.name);
      const content = await readFile(path, 'utf8');
      yield { path, rel: rel.replace(/\\/g, '/'), content };
    }
  }

  for (const root of roots) {
    yield* walk(join(REPO_ROOT, root), root);
  }
}

export async function readJsonFromRepo(relPath) {
  const { readFile: rf } = await import('node:fs/promises');
  const raw = await rf(join(REPO_ROOT, relPath), 'utf8');
  return JSON.parse(raw);
}

export function relFromRoot(absPath) {
  return relative(REPO_ROOT, absPath).replace(/\\/g, '/');
}
