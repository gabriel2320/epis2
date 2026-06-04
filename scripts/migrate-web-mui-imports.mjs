#!/usr/bin/env node
/** One-off: mueve imports @mui de apps/web a @epis2/epis2-ui */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const WEB_SRC = join(process.cwd(), 'apps/web/src');

async function* walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else if (/\.(tsx?)$/.test(ent.name)) yield p;
  }
}

const MUI_IMPORT =
  /^import\s+(?:(\w+)\s+from\s+|\{([^}]+)\}\s+from\s+)?['"]@mui\/(?:material|icons-material)\/([^'"]+)['"];?\s*$/gm;

function parseLine(line) {
  const def = /^import\s+(\w+)\s+from\s+['"]@mui\//.exec(line);
  if (def) return [def[1]];
  const named = /^import\s+\{([^}]+)\}\s+from\s+['"]@mui\//.exec(line);
  if (named) {
    return named[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop().trim());
  }
  return [];
}

async function main() {
  for await (const path of walk(WEB_SRC)) {
    let content = await readFile(path, 'utf8');
    if (!content.includes('@mui/')) continue;

    const symbols = new Set();
    const lines = content.split('\n');
    const kept = [];

    for (const line of lines) {
      if (/from\s+['"]@mui\//.test(line)) {
        for (const s of parseLine(line)) symbols.add(s);
      } else {
        kept.push(line);
      }
    }

    if (symbols.size === 0) continue;

    const sorted = [...symbols].sort();
    const episImport = `import {\n  ${sorted.join(',\n  ')},\n} from '@epis2/epis2-ui';`;

    let insertAt = 0;
    while (
      insertAt < kept.length &&
      (kept[insertAt].startsWith('import ') || kept[insertAt].trim() === '')
    ) {
      insertAt++;
    }

    kept.splice(insertAt, 0, episImport);
    await writeFile(path, kept.join('\n'), 'utf8');
    console.log(path.replace(process.cwd(), ''), '→', sorted.length, 'símbolos');
  }
}

main();
