import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './lib/paths.mjs';
import { walkSourceFiles } from './lib/scan-sources.mjs';

const FORBIDDEN_DEPS = [
  '@openmrs',
  'openmrs-esm',
  '@carbon',
  'carbon-components',
  'carbon-react',
  '@ibm/plex',
];

const FORBIDDEN_IMPORT_PATTERNS = [
  /@openmrs\//i,
  /openmrs-esm/i,
  /@carbon\//i,
  /carbon-components/i,
  /from\s+['"]\.\.\/Epis\//i,
  /from\s+['"]epis-ui/i,
  /from\s+['"]@epis\/(?!2)/i,
  /Soft Carbon/i,
];

const FORBIDDEN_PATH_SNIPPETS = [
  '/home/epis-clinical-panel',
  'epis-clinical-panel',
  'EpisSoftCarbon',
  'openmrs-esm',
];

export async function validate() {
  const details = [];

  async function scanPackageJson(dir, rel) {
    const pkgPath = join(dir, 'package.json');
    try {
      const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
      for (const name of Object.keys(deps ?? {})) {
        for (const forbidden of FORBIDDEN_DEPS) {
          if (name === forbidden || name.startsWith(`${forbidden}/`)) {
            details.push(`${rel}/package.json → dependencia prohibida: ${name}`);
          }
        }
      }
    } catch {
      /* no package.json */
    }
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory() && e.name !== 'node_modules' && e.name !== 'dist') {
        await scanPackageJson(join(dir, e.name), `${rel}/${e.name}`);
      }
    }
  }

  await scanPackageJson(REPO_ROOT, '.');

  for await (const { rel, content } of walkSourceFiles()) {
    if (rel.endsWith('package-lock.json')) continue;
    for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
      if (pattern.test(content)) {
        details.push(`${rel} → import o referencia legacy prohibida`);
        break;
      }
    }
    for (const snippet of FORBIDDEN_PATH_SNIPPETS) {
      if (content.includes(snippet)) {
        details.push(`${rel} → ruta o símbolo legacy: ${snippet}`);
      }
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Sin dependencias ni imports OpenMRS/O3/Carbon/EPIS'
        : 'Se detectaron dependencias o referencias legacy',
    details,
  };
}
