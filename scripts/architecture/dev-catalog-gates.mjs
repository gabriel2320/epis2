import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { walkSourceFiles } from './lib/scan-sources.mjs';
import { REPO_ROOT } from './lib/paths.mjs';

/** MUI-G15 — catálogos dev no expuestos en UI clínica ni sin guard en router. */
const CATALOGS = [
  {
    path: '/dev/ui-catalog',
    guardFn: 'isUiCatalogEnabled',
    envRel: 'apps/web/src/dev/uiCatalogEnv.ts',
    envFlag: 'VITE_ENABLE_UI_CATALOG',
  },
  {
    path: '/desarrollo/catalogo-visual',
    guardFn: 'isVisualThemeCatalogEnabled',
    envRel: 'apps/web/src/dev/visualThemeCatalogEnv.ts',
    envFlag: 'VITE_ENABLE_VISUAL_THEME_CATALOG',
  },
  {
    path: '/dev/scheduler-spike',
    guardFn: 'isSchedulerSpikeEnabled',
    envRel: 'apps/web/src/dev/schedulerSpikeEnv.ts',
    envFlag: 'VITE_ENABLE_SCHEDULER_SPIKE',
  },
];

const CATALOG_PATH_RE = /\/dev\/ui-catalog|\/desarrollo\/catalogo-visual|\/dev\/scheduler-spike/;

export async function validate() {
  const details = [];
  const routerPath = join(REPO_ROOT, 'apps/web/src/routes/router.tsx');
  let router = '';

  try {
    router = await readFile(routerPath, 'utf8');
  } catch {
    details.push('apps/web/src/routes/router.tsx → no encontrado');
    return fail(details);
  }

  for (const catalog of CATALOGS) {
    if (
      !router.includes(`path: '${catalog.path}'`) &&
      !router.includes(`path: "${catalog.path}"`)
    ) {
      details.push(`router → falta ruta ${catalog.path}`);
      continue;
    }
    if (!router.includes(catalog.guardFn)) {
      details.push(`router → ${catalog.path} sin guard ${catalog.guardFn}()`);
    }

    let envContent = '';
    try {
      envContent = await readFile(join(REPO_ROOT, catalog.envRel), 'utf8');
    } catch {
      details.push(`${catalog.envRel} → no encontrado`);
      continue;
    }

    if (!envContent.includes(`export function ${catalog.guardFn}`)) {
      details.push(`${catalog.envRel} → falta ${catalog.guardFn}()`);
    }
    if (!envContent.includes(catalog.envFlag)) {
      details.push(`${catalog.envRel} → falta flag ${catalog.envFlag}`);
    }
    if (!envContent.includes("flag === 'false'")) {
      details.push(`${catalog.envRel} → debe respetar ${catalog.envFlag}=false`);
    }
    if (!envContent.includes('import.meta.env.DEV')) {
      details.push(`${catalog.envRel} → debe activar solo en DEV por defecto`);
    }
  }

  let envExample = '';
  try {
    envExample = await readFile(join(REPO_ROOT, '.env.example'), 'utf8');
    for (const catalog of CATALOGS) {
      if (!envExample.includes(catalog.envFlag)) {
        details.push(`.env.example → documentar ${catalog.envFlag}`);
      }
      if (new RegExp(`^${catalog.envFlag}=true`, 'm').test(envExample)) {
        details.push(
          `.env.example → ${catalog.envFlag}=true activo por defecto (prohibido en piloto)`,
        );
      }
    }
  } catch {
    details.push('.env.example → no encontrado');
  }

  for await (const { rel, content } of walkSourceFiles({ roots: ['apps/web/src'] })) {
    if (rel.includes('/dev/') || rel.includes('\\dev\\')) continue;
    if (rel.includes('routes/router')) continue;
    if (!CATALOG_PATH_RE.test(content)) continue;
    details.push(`${rel} → enlace a catálogo dev en UI no-dev (MUI-G15)`);
  }

  return fail(details);
}

function fail(details) {
  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Catálogos dev con guard y sin enlaces en UI clínica'
        : 'Catálogos dev deben estar gated (MUI-G15)',
    details,
  };
}
