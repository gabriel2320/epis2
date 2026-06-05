import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WIDGETS_PKG = path.join(ROOT, 'packages/epis2-widgets');

const FORBIDDEN_PATTERNS = [
  { re: /from\s+['"]@mui\/material/, msg: 'widget package no debe importar MUI directamente' },
  { re: /kind:\s*['"]write/, msg: 'acción clínica directa prohibida' },
  { re: /kind:\s*['"]approve/, msg: 'acción clínica directa prohibida' },
  { re: /homeRoute:\s*['"]\/comando/, msg: 'dashboard no puede ser home' },
  { re: /aiMode:\s*['"]required/, msg: 'IA no puede ser obligatoria sin fallback' },
];

export async function validate() {
  const details = [];
  const files = [
    'src/registry/demo-widget-definitions.ts',
    'src/registry/widget-registry.ts',
    'src/registry/widget-registry-gates.ts',
  ];

  for (const rel of files) {
    const abs = path.join(WIDGETS_PKG, rel);
    let content;
    try {
      content = await readFile(abs, 'utf8');
    } catch {
      details.push(`No se encontró ${rel}`);
      continue;
    }
    for (const { re, msg } of FORBIDDEN_PATTERNS) {
      if (re.test(content)) details.push(`${rel}: ${msg}`);
    }
  }

  // Verificar que apps/web no importe MUI para widgets (gate de frontera UI)
  const webWidgets = path.join(ROOT, 'apps/web/src/widgets');
  try {
    const { readdir } = await import('node:fs/promises');
    const entries = await readdir(webWidgets, { recursive: true }).catch(() => []);
    if (entries.length > 0) {
      details.push('apps/web/src/widgets no debe existir en WIDGET-00 (usar epis2-ui)');
    }
  } catch {
    // carpeta inexistente — OK
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Gates de definiciones de widgets (WIDGET-00)'
        : 'Violaciones en gates de widgets',
    details,
  };
}
